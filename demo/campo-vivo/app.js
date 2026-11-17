/* Campo Vivo - app dimostrativa sopra il kit Noxford. Nessun dato viene inviato: le prenotazioni restano nel browser. */
(function () {
  "use strict";
  var d = document, esc = NX.esc;
  var $ = function (s, r) { return (r || d).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); };
  var euro = function (n) { return (n % 1 ? n.toFixed(2).replace(".", ",") : n) + " €"; };
  var mem = {
    get: function (k, def) { try { var v = localStorage.getItem("campovivo-" + k); return v ? JSON.parse(v) : def; } catch (e) { return def; } },
    set: function (k, v) { try { localStorage.setItem("campovivo-" + k, JSON.stringify(v)); } catch (e) {} }
  };

  /* ---------- preferenze: ?stile=a|b|c, ?tema=chiaro|scuro, ?vetro=si|no ---------- */
  var q = new URLSearchParams(location.search);
  var stile = /^[abc]$/.test(q.get("stile") || "") ? q.get("stile") : "a";
  var STILI = [["a", "Classico", "Scegli il campo e vedi le sue ore, con liste raggruppate."], ["b", "Editoriale", "Foto grandi e ore libere divise in mattina, pomeriggio e sera."], ["c", "Compatto", "Tabellone con tutti i campi e tutte le ore insieme."]];
  NX.pref.init();
  if (q.get("tema")) NX.pref.tema(q.get("tema"), { salva: false });
  if (q.get("vetro")) NX.pref.vetro(q.get("vetro") !== "no", { salva: false });
  function scriviUrl(tutto) {
    var p = new URLSearchParams(location.search); p.set("stile", stile);
    if (tutto) { p.set("tema", NX.pref.temaAttivo()); p.set("vetro", NX.pref.vetroAttivo() ? "si" : "no"); }
    try { history.replaceState(null, "", location.pathname + "?" + p.toString() + location.hash); } catch (e) {}
  }
  d.addEventListener("nx:pref", function () { scriviUrl(true); });

  /* ---------- dati di esempio ---------- */
  var IC = {
    chev: '<svg class="x-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
    campo: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="3" width="16" height="18" rx="1"/><path d="M4 12h16M12 3v5M12 16v5"/></svg>',
    peso: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10h3v4H3zM18 10h3v4h-3zM6 8h2v8H6zM16 8h2v8h-2zM8 12h8"/></svg>'
  };
  var GG = ["dom", "lun", "mar", "mer", "gio", "ven", "sab"], GGL = ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"];
  var giorno = function (k) { var x = new Date(); x.setHours(12, 0, 0, 0); x.setDate(x.getDate() + k); return x; };
  var ORE = []; for (var h = 8; h <= 22; h++) ORE.push(h + ":00");
  var CAMPI = ["Campo 1", "Campo 2", "Campo 3"];
  var PREZZO = function (ora, dur) { var base = parseInt(ora, 10) >= 18 ? 48 : 36; return dur === 90 ? base * 1.5 : base; };
  var occ = function (k, o, c) {
    if (k === 0 && parseInt(ORE[o], 10) <= new Date().getHours()) return true;
    var g = giorno(k).getDate(); return ((g * 5 + o * 7 + c * 11) % 9) < 4 || (o >= 10 && o <= 13 && (g + c) % 3 === 0);
  };
  var CORSI = [
    { id: "funz", n: "Allenamento funzionale", ora: "7:00", min: 45, coach: "Chiara", ruolo: "Preparatrice atletica", liv: "Tutti", posti: 14, pres: 9, g: [1, 3, 5], img: "img/sala.webp", d: "Circuito a stazioni con kettlebell, corda e box. Ogni esercizio ha la versione più facile.", port: ["Scarpe da ginnastica pulite", "Asciugamano", "Borraccia"] },
    { id: "scuola", n: "Scuola padel principianti", ora: "18:00", min: 60, coach: "Luca", ruolo: "Maestro di padel", liv: "Principiante", posti: 4, pres: 3, g: [2, 4], img: "img/padel.webp", d: "Quattro persone per campo: impugnatura, colpi base, uso delle pareti. Racchette in prestito.", port: ["Scarpe da padel o da tennis", "Racchetta, se ce l'hai"] },
    { id: "pilates", n: "Pilates matwork", ora: "13:15", min: 50, coach: "Sara", ruolo: "Istruttrice di pilates", liv: "Tutti", posti: 12, pres: 5, g: [1, 2, 3, 4, 5], img: "img/sala.webp", d: "Lezione sul tappetino per schiena e postura, ritmo calmo.", port: ["Calze antiscivolo", "Tappetino, se preferisci il tuo"] },
    { id: "match", n: "Americano del venerdì", ora: "20:30", min: 120, coach: "Luca", ruolo: "Organizza il torneo", liv: "B1 - B3", posti: 16, pres: 13, g: [5], img: "img/padel.webp", d: "Torneo a rotazione: si cambia compagno a ogni partita. Si chiude con una birra al bar.", port: ["Racchetta", "Voglia di giocare con persone nuove"] },
    { id: "gag", n: "Total body", ora: "19:00", min: 50, coach: "Chiara", ruolo: "Preparatrice atletica", liv: "Intermedio", posti: 14, pres: 14, g: [1, 3], img: "img/sala.webp", d: "Forza e resistenza per tutto il corpo, con pesi leggeri e corpo libero.", port: ["Scarpe da ginnastica", "Asciugamano"] },
    { id: "kids", n: "Padel ragazzi 8-14 anni", ora: "17:00", min: 60, coach: "Luca", ruolo: "Maestro di padel", liv: "Ragazzi", posti: 8, pres: 6, g: [3, 6], img: "img/padel.webp", d: "Gioco e tecnica divisi per età. I genitori possono guardare dal bar.", port: ["Scarpe da ginnastica", "Merenda"] }
  ];
  var st = mem.get("stato2", null) || { pren: [], ingressi: 8 };
  var salva = function () { mem.set("stato2", st); };
  var sel = { g: 0, c: 0, dur: 90 }, cg = 0, primaVolta = true;
  var byId = function (id) { return CORSI.filter(function (c) { return c.id === id; })[0]; };
  var gTesto = function (k) { var x = giorno(k); return k === 0 ? "oggi" : k === 1 ? "domani" : GGL[x.getDay()] + " " + x.getDate(); };
  var prenotato = function (id, k) { return st.pren.some(function (p) { return p.corso === id && p.k === k; }); };
  var liberiDi = function (k) { var l = []; ORE.forEach(function (o, i) { CAMPI.forEach(function (c, j) { if (!occ(k, i, j)) l.push([i, j]); }); }); return l; };
  var mioSlot = function (k, i, j) { return st.pren.some(function (p) { return p.campo === j && p.o === i && p.k === k && p.ts > Date.now() - 864e5; }); };
  var futuri = function () { var ieri = Date.now() - 864e5; return st.pren.filter(function (p) { return p.ts > ieri; }).sort(function (a, b) { return a.ts - b.ts; }); };
  function chipGiorni(k, attr) {
    var h = '<div class="x-giorni" role="group" aria-label="Giorno">';
    for (var i = 0; i < 7; i++) { var x = giorno(i); h += '<button type="button" ' + attr + '="' + i + '" aria-pressed="' + (i === k) + '" aria-label="' + gTesto(i) + '"><small>' + (i ? GG[x.getDay()] : "oggi") + "</small><b>" + x.getDate() + "</b></button>"; }
    return h + "</div>";
  }

  /* ---------- viste ---------- */
  var titolo = "";
  function cartaNext() {
    var p = futuri()[0];
    if (p) return '<a class="x-card c-next" href="#/io" data-nx-premi><span class="c-ora">' + p.ora + '</span><span class="t"><b>' + esc(p.n) + "</b><small>" + p.quando + '</small></span><i class="nx-chev"></i></a>';
    var n = liberiDi(0).length, k = n ? 0 : 1;
    return '<a class="x-card c-next" href="#/campi" data-nx-premi><span class="c-ora">' + (n || liberiDi(1).length) + '</span><span class="t"><b>ore libere ' + (k ? "domani" : "oggi") + '</b><small>Tocca per vedere i campi</small></span><i class="nx-chev"></i></a>';
  }
  function vHome() {
    titolo = "Ciao, Davide";
    if (stile === "b") {
      var sera = []; [0, 1].forEach(function (k) { liberiDi(k).forEach(function (s) { if (s[0] >= 10 && sera.length < 4) sera.push([k, s[0], s[1]]); }); });
      return '<div class="x-foto c-hero-b"><img src="img/padel.webp" width="1000" height="747" alt="Campo da padel coperto con erba blu, pareti di vetro e luci accese, una racchetta e tre palline vicino alla rete" fetchpriority="high"><div class="x-foto-tx"><small>Padel · Fitness · Corsi</small><h1>Il campo libero lo trovi in dieci secondi.</h1><a class="nx-btn" href="#/campi">Vedi i campi liberi</a></div></div>' +
        (futuri().length ? '<h2 class="x-sez">La tua prossima partita</h2>' + cartaNext() : "") +
        '<h2 class="x-sez">Liberi in serata</h2><ul class="nx-lista c-righe">' + sera.map(function (s) { return '<li><button type="button" class="nx-cella" data-slot="' + s[0] + "|" + s[1] + "|" + s[2] + '"><span class="c-ora">' + ORE[s[1]] + '</span><span class="nx-c-tx"><b>' + CAMPI[s[2]] + "</b><small>" + gTesto(s[0]) + " · " + euro(PREZZO(ORE[s[1]], 90)) + ' per 90 min</small></span><i class="nx-chev"></i></button></li>'; }).join("") + "</ul>" +
        '<h2 class="x-sez">La sala</h2><a class="x-card c-ed-c" href="#/corsi" data-nx-premi><div class="x-foto"><img src="img/sala.webp" width="1200" height="896" alt="Sala di allenamento funzionale vuota con kettlebell, box di legno e vogatori" loading="lazy"></div><div class="c-ed-t"><h3>Aperta dalle 6:30</h3><p>Entri con il tuo abbonamento e il codice nell\'app. Corsi tutti i giorni.</p></div></a>';
    }
    if (stile === "c") {
      var p = futuri()[0], strip = []; [0, 1, 2].forEach(function (k) { liberiDi(k).forEach(function (s) { if (strip.length < 10) strip.push([k, s[0], s[1]]); }); });
      var dow = giorno(0).getDay(), oggiC = CORSI.filter(function (c) { return c.g.indexOf(dow) > -1; });
      return '<div class="c-kpi"><a class="x-card" href="#/io"><b>' + st.ingressi + '</b><small>ingressi in sala</small></a><a class="x-card" href="#/io"><b>' + (p ? p.ora : "-") + "</b><small>" + (p ? p.quando : "nessuna prenotazione") + '</small></a><a class="x-card" href="#/campi"><b>' + liberiDi(0).length + "</b><small>ore libere oggi</small></a></div>" +
        '<div class="x-sez-r"><h2 class="x-sez">Prenota al volo</h2><a href="#/campi">Tabellone</a></div><div class="c-strip">' + strip.map(function (s) { return '<button type="button" data-slot="' + s[0] + "|" + s[1] + "|" + s[2] + '"><b>' + ORE[s[1]] + " · C" + (s[2] + 1) + "</b><small>" + gTesto(s[0]) + "</small></button>"; }).join("") + "</div>" +
        '<h2 class="x-sez">Corsi di oggi</h2>' + (oggiC.length ? '<ul class="nx-lista c-righe">' + oggiC.map(rigaCorso).join("") + "</ul>" : '<div class="x-card">' + NX.stato.vuoto("Oggi niente corsi", "Il circolo è aperto per i campi e la sala.", ["Vedi la settimana", "corsi"]) + "</div>");
    }
    return '<div class="x-foto c-hero-a"><img src="img/padel.webp" width="1000" height="747" alt="Campo da padel coperto con erba blu, pareti di vetro e luci accese, una racchetta e tre palline vicino alla rete" fetchpriority="high"><div class="x-foto-tx"><h2>Il campo libero lo trovi in dieci secondi.</h2><p>Tre campi coperti, dalle 8 alle 23.</p></div></div>' +
      cartaNext() +
      '<h2 class="x-sez">Cosa vuoi fare</h2><ul class="nx-lista">' +
      '<li><a class="nx-cella ic" href="#/campi"><span class="nx-c-ic">' + IC.campo + '</span><span class="nx-c-tx"><b>Prenota un campo</b><small>36 € l\'ora, 48 € dalle 18</small></span><i class="nx-chev"></i></a></li>' +
      '<li><a class="nx-cella ic" href="#/corsi"><span class="nx-c-ic">' + IC.peso + '</span><span class="nx-c-tx"><b>Corsi della settimana</b><small>funzionale, pilates, scuola padel</small></span><i class="nx-chev"></i></a></li></ul>' +
      '<h2 class="x-sez">Sala funzionale</h2><div class="x-foto c-sala"><img src="img/sala.webp" width="1200" height="896" alt="Sala di allenamento funzionale vuota con kettlebell, box di legno e vogatori" loading="lazy"><div class="x-foto-tx"><h2>Aperta dalle 6:30</h2><p>Entri con l\'abbonamento e il codice nell\'app.</p></div></div>';
  }
  function legenda() { return '<div class="c-legenda"><span><i class="l"></i>Libero</span><span><i class="o"></i>Occupato</span><span><i class="t"></i>Tuo</span></div>'; }
  function tabellone() {
    if (stile === "c") {
      var h = '<div class="c-griglia"><span></span>' + CAMPI.map(function (c, j) { return '<span class="h">C' + (j + 1) + "</span>"; }).join("");
      ORE.forEach(function (o, i) {
        h += '<span class="o">' + o + "</span>";
        CAMPI.forEach(function (c, j) {
          var mio = mioSlot(sel.g, i, j), no = occ(sel.g, i, j) || mio;
          h += '<button type="button" data-slot="' + sel.g + "|" + i + "|" + j + '"' + (no ? " disabled" : "") + (mio ? ' style="background:var(--nx-tinta-pieno)"' : "") + ' aria-label="' + c + " alle " + o + (mio ? ", prenotato da te" : no ? ", occupato" : ", libero") + '">' + (no ? "" : euro(PREZZO(o, 60))) + "</button>";
        });
      });
      return legenda() + h + "</div>";
    }
    if (stile === "b") {
      var F = [["Mattina", "dalle 8 alle 13", 0, 5], ["Pomeriggio", "dalle 13 alle 18", 5, 10], ["Sera", "dalle 18, luci comprese", 10, 15]];
      return F.map(function (f) {
        var l = []; for (var i = f[2]; i < f[3]; i++) CAMPI.forEach(function (c, j) { if (!occ(sel.g, i, j) && !mioSlot(sel.g, i, j)) l.push([i, j]); });
        return '<section class="x-card c-fascia"><h3>' + f[0] + "</h3><small>" + f[1] + " · " + (l.length ? l.length + (l.length === 1 ? " ora libera" : " ore libere") : "tutto pieno") + '</small><div class="c-chips">' + l.map(function (s) { return '<button type="button" data-slot="' + sel.g + "|" + s[0] + "|" + s[1] + '">' + ORE[s[0]] + "<small>C" + (s[1] + 1) + "</small></button>"; }).join("") + "</div></section>";
      }).join("");
    }
    var lib = 0;
    var ore = ORE.map(function (o, i) {
      var mio = mioSlot(sel.g, i, sel.c), no = occ(sel.g, i, sel.c) || mio; if (!no) lib++;
      return '<button type="button" data-slot="' + sel.g + "|" + i + "|" + sel.c + '"' + (no ? " disabled" : "") + ' aria-label="' + o + (mio ? ", prenotato da te" : no ? ", occupato" : ", libero") + '"><b>' + o + "</b><small>" + (mio ? "tuo" : sel.g === 0 && parseInt(o, 10) <= new Date().getHours() ? "passato" : no ? "occupato" : euro(PREZZO(o, 60))) + "</small></button>";
    }).join("");
    return '<div class="nx-seg pieno" id="c-campo" role="group" aria-label="Campo" style="margin-bottom:14px">' + CAMPI.map(function (c, j) { return '<button type="button" data-v="' + j + '" aria-pressed="' + (j === sel.c) + '">' + c + "</button>"; }).join("") + "</div>" +
      (lib ? '<div class="c-ore">' + ore + "</div>" : '<div class="x-card">' + NX.stato.vuoto("Nessuna ora libera", "Questo campo è pieno. Prova un altro campo o un altro giorno.") + "</div>");
  }
  function vCampi() {
    titolo = "Campi";
    if (primaVolta) { primaVolta = false; if (liberiDi(0).length < 8) sel.g = 1; }
    return chipGiorni(sel.g, "data-g") + '<div id="c-tab" style="margin-top:14px">' + tabellone() + "</div>" + '<p class="x-nota">Prezzo per campo intero, 60 minuti. Disdetta gratuita fino a 3 ore prima.</p>';
  }
  function liberiCorso(c) { return c.posti - c.pres - (prenotato(c.id, cg) ? 1 : 0); }
  function pillPosti(c) { var l = liberiCorso(c); return '<span class="nx-pill c-posti ' + (l < 1 ? "no" : l <= 2 ? "wait" : "ok") + '">' + (l > 0 ? l + (l === 1 ? " posto" : " posti") : "Pieno") + "</span>"; }
  function rigaCorso(c) {
    return '<li><a class="nx-cella" href="#/lezione/' + c.id + '"><span class="c-ora">' + c.ora + '</span><span class="nx-c-tx"><b>' + esc(c.n) + "</b><small>" + c.min + " min · con " + c.coach + "</small></span>" + pillPosti(c) + "</a></li>";
  }
  function listaCorsi() {
    var dow = giorno(cg).getDay(), l = CORSI.filter(function (c) { return c.g.indexOf(dow) > -1; }).sort(function (a, b) { return parseFloat(a.ora.replace(":", ".")) - parseFloat(b.ora.replace(":", ".")); });
    if (!l.length) return '<div class="x-card">' + NX.stato.vuoto("Nessun corso in questo giorno", "Il circolo è aperto per i campi e la sala.", ["Prenota un campo", "campi"]) + "</div>";
    if (stile === "b") return '<div class="c-ed">' + l.map(function (c) { return '<a class="x-card c-ed-c" href="#/lezione/' + c.id + '" data-nx-premi><div class="x-foto"><img src="' + c.img + '" alt="" loading="lazy" width="800" height="400"></div><div class="c-ed-t"><h3>' + esc(c.n) + "</h3><p>" + esc(c.d) + '</p><div class="c-ed-m"><span class="nx-pill acc">' + c.ora + " · " + c.min + " min</span>" + pillPosti(c) + "</div></div></a>"; }).join("") + "</div>";
    if (stile === "c") return '<ul class="nx-lista c-righe">' + l.map(function (c) {
      var lib = liberiCorso(c), gia = prenotato(c.id, cg);
      return '<li><div class="nx-cella"><span class="c-ora">' + c.ora + '</span><a class="nx-c-tx" href="#/lezione/' + c.id + '" style="color:inherit;text-decoration:none"><b>' + esc(c.n) + "</b><small>" + c.min + " min · " + Math.max(0, lib) + "/" + c.posti + " liberi</small></a>" + (gia ? '<span class="nx-pill ok">Iscritto</span>' : '<button type="button" class="nx-btn p" data-iscrivi="' + c.id + '"' + (lib < 1 ? " disabled" : "") + ">" + (lib < 1 ? "Pieno" : "Prenota") + "</button>") + "</div></li>";
    }).join("") + "</ul>";
    return '<ul class="nx-lista c-righe">' + l.map(rigaCorso).join("") + "</ul>";
  }
  function vCorsi() { titolo = "Corsi"; return chipGiorni(cg, "data-cg") + '<div id="c-corsi" style="margin-top:14px">' + listaCorsi() + "</div>"; }
  function vLezione(id) {
    var c = byId(id);
    if (!c) { titolo = "Lezione"; return NX.stato.errore("Lezione non trovata", "Il collegamento non è più valido.", ["Vedi i corsi", "corsi"]); }
    titolo = c.n;
    var lib = liberiCorso(c), gia = prenotato(c.id, cg);
    return '<div class="c-l-head"><small>' + gTesto(cg).replace(/^./, function (x) { return x.toUpperCase(); }) + " · " + c.ora + "</small><p>" + esc(c.d) + "</p></div>" +
      '<div class="c-dati"><div class="x-card"><b>' + c.min + "'</b><small>durata</small></div><div class=\"x-card\"><b>" + c.liv + '</b><small>livello</small></div><div class="x-card"><b>' + Math.max(0, lib) + "/" + c.posti + "</b><small>posti liberi</small></div></div>" +
      '<div class="x-card c-coach"><span class="nx-av">' + c.coach[0] + "</span><div><b>" + c.coach + "</b><small>" + c.ruolo + " · nome di esempio</small></div></div>" +
      '<h2 class="x-sez">Cosa portare</h2><ul class="x-card x-pad c-port" style="margin:0;padding-left:34px">' + c.port.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>" +
      (gia ? '<button class="nx-btn pieno x-cta" type="button" disabled>Sei già iscritto</button>' : '<button class="nx-btn p pieno x-cta" type="button" data-iscrivi="' + c.id + '"' + (lib < 1 || st.ingressi < 1 ? " disabled" : "") + ">" + (lib < 1 ? "Lezione piena" : st.ingressi < 1 ? "Ingressi finiti" : "Prenota il posto · 1 ingresso") + "</button>") +
      '<p class="x-nota">Puoi disdire fino a 3 ore prima senza perdere l\'ingresso.</p>';
  }
  function vIo() {
    titolo = "Ciao, Davide";
    var f = futuri();
    return '<div class="c-abbo"><small class="k">Abbonamento Open</small><h2>Valido fino al 31 gennaio</h2><div class="n"><div><b>' + st.ingressi + "</b><small>ingressi in sala rimasti</small></div><div><b>B2</b><small>il tuo livello padel</small></div></div><p class=\"cod\">Codice d'ingresso<b>CV-4821</b></p></div>" +
      '<h2 class="x-sez">Le tue prenotazioni</h2>' +
      (f.length ? '<ul class="nx-lista c-righe">' + f.map(function (p) { return '<li><div class="nx-cella"><span class="c-ora">' + p.ora + '</span><span class="nx-c-tx"><b>' + esc(p.n) + "</b><small>" + p.quando + '</small></span><button type="button" class="nx-btn t r" data-disdici="' + p.id + '">Disdici</button></div></li>'; }).join("") + "</ul>"
        : '<div class="x-card">' + NX.stato.vuoto("Nessuna prenotazione", "Prenota un campo o un posto a lezione: lo trovi qui.", ["Vedi i campi", "campi"]) + "</div>") +
      '<h2 class="x-sez">Giocate di recente</h2><ul class="nx-lista c-righe"><li><div class="nx-cella"><span class="c-ora">19:00</span><span class="nx-c-tx"><b>Campo 2 · 90 minuti</b><small>giovedì scorso · esempio</small></span></div></li></ul>' +
      '<p class="x-nota">Profilo, abbonamento e storico sono di esempio. Le prenotazioni nuove restano solo in questo browser.</p>';
  }

  /* ---------- router ---------- */
  var V = {
    home: { tab: "home", r: vHome, noTit: function () { return stile === "b"; } },
    campi: { tab: "campi", r: vCampi, dopo: function () { segCampo(); } },
    corsi: { tab: "corsi", r: vCorsi },
    lezione: { tab: "corsi", r: vLezione, back: ["#/corsi", "Corsi"] },
    io: { tab: "io", r: vIo }
  };
  var ORD = ["home", "campi", "corsi", "lezione", "io"], corrente = null;
  var box = $("#x-vista");
  function segCampo() { var s = $("#c-campo"); if (s) NX.seg(s, function (v) { sel.c = +v; NX.vista($("#c-tab"), tabellone()); segCampo(); }); }
  function mostra(anim) {
    var p = location.hash.replace(/^#\/?/, "").split("/"), n = V[p[0]] ? p[0] : "home", v = V[n];
    var html = v.r(p[1] ? decodeURIComponent(p[1]) : "");
    var verso = corrente && ORD.indexOf(n) < ORD.indexOf(corrente) ? "sx" : "dx";
    if (anim) NX.vista(box, html, verso); else box.innerHTML = html;
    $("#x-tit").textContent = titolo; $("#x-pic").textContent = n === "home" ? "Campo Vivo" : titolo;
    $("#x-nb-sx").innerHTML = v.back ? '<a class="nx-btn t x-back" href="' + v.back[0] + '">' + IC.chev + v.back[1] + "</a>" : '<a class="nx-btn c-cred" href="#/io" aria-label="' + st.ingressi + ' ingressi in sala rimasti">' + st.ingressi + " ingressi</a>";
    d.body.classList.toggle("x-no-tit", !!(v.noTit && v.noTit()));
    $$("#x-tab a").forEach(function (a) { if (a.getAttribute("data-tab") === v.tab) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
    d.title = (n === "home" ? "Campo Vivo · Padel e palestra" : titolo + " · Campo Vivo") + " (app dimostrativa)";
    if (v.dopo) v.dopo(p[1]);
    corrente = n;
  }
  function applicaStile() { d.body.setAttribute("data-stile", stile); }

  /* ---------- fogli ---------- */
  function opzioni() {
    var f = NX.foglio.apri({
      titolo: "Opzioni della demo",
      html: '<div class="nx-campo"><span>Stile dell\'app</span><div class="nx-seg pieno" id="o-stile" role="group" aria-label="Stile dell\'app">' + STILI.map(function (s) { return '<button type="button" data-v="' + s[0] + '" aria-pressed="' + (s[0] === stile) + '">' + s[1] + "</button>"; }).join("") + '</div><small id="o-desc">' + STILI.filter(function (s) { return s[0] === stile; })[0][2] + "</small></div>" +
        '<ul class="nx-lista"><li><label class="nx-cella nx-toggle" style="justify-content:space-between"><span>Tema scuro</span><input type="checkbox" class="o-t"><i></i></label></li><li><label class="nx-cella nx-toggle" style="justify-content:space-between"><span>Effetto vetro</span><input type="checkbox" class="o-v"><i></i></label></li></ul>' +
        '<p class="x-nota">Circolo inventato, dati di esempio. Le scelte restano solo in questo browser.</p>'
    });
    NX.seg(f.querySelector("#o-stile"), function (v) {
      stile = v; applicaStile(); scriviUrl(); mostra(true);
      f.querySelector("#o-desc").textContent = STILI.filter(function (s) { return s[0] === stile; })[0][2];
    });
    NX.pref.collega(f.querySelector(".o-t"), "tema");
    NX.pref.collega(f.querySelector(".o-v"), "vetro");
  }
  function foglioCampo(k, i, j) {
    var dur = sel.dur;
    function corpo() {
      var p = PREZZO(ORE[i], dur);
      return '<p style="margin:0;color:var(--nx-tx2)">' + gTesto(k).replace(/^./, function (x) { return x.toUpperCase(); }) + " · campo coperto, luci comprese</p>" +
        '<div class="nx-campo" style="margin-top:16px"><span>Durata</span><div class="nx-seg pieno" id="f-dur" role="group" aria-label="Durata"><button type="button" data-v="60" aria-pressed="' + (dur === 60) + '">60 minuti</button><button type="button" data-v="90" aria-pressed="' + (dur === 90) + '">90 minuti</button></div></div>' +
        '<div class="c-split" aria-live="polite"><span>' + euro(p) + ' in totale</span><span><b id="f-quota">' + euro(Math.round(p / 4 * 100) / 100) + "</b> a testa in 4</span></div>" +
        '<p class="x-nota">Si paga alla reception. In questa demo la prenotazione resta solo nel browser.</p>';
    }
    var f = NX.foglio.apri({ titolo: CAMPI[j] + " · " + ORE[i], html: corpo(), piede: '<button type="button" class="nx-btn p" id="f-ok">Prenota il campo</button>' });
    function seg() { NX.seg(f.querySelector("#f-dur"), function (v) { dur = +v; sel.dur = dur; f.querySelector(".nx-foglio-corpo").innerHTML = corpo(); seg(); }); }
    seg();
    f.querySelector("#f-ok").addEventListener("click", function () {
      var ts = giorno(k); ts.setHours(parseInt(ORE[i], 10), 0, 0, 0);
      var p = { id: "p" + Date.now().toString(36), n: CAMPI[j] + " · " + dur + " minuti", ora: ORE[i], quando: gTesto(k), k: k, o: i, campo: j, ts: ts.getTime() };
      st.pren.push(p); salva();
      var quota = euro(Math.round(PREZZO(ORE[i], dur) / 4 * 100) / 100);
      var testo = "Ho prenotato il " + CAMPI[j] + " a Campo Vivo, " + gTesto(k) + " alle " + ORE[i] + " per " + dur + " minuti. Quota " + quota + " a testa. Ci sei?";
      f.querySelector(".nx-foglio-riga h2").textContent = "Campo prenotato";
      f.querySelector(".nx-foglio-corpo").innerHTML = '<p style="margin:0 0 8px"><b>' + CAMPI[j] + "</b>, " + gTesto(k) + " alle " + ORE[i] + ", " + dur + " minuti.</p><p style=\"margin:0;color:var(--nx-tx2)\">Lo trovi in Io. Mancano i compagni? Manda l'invito già scritto.</p>";
      f.querySelector(".nx-foglio-piede").innerHTML = '<a class="nx-btn p" id="f-wa" href="https://wa.me/?text=' + encodeURIComponent(testo) + '" target="_blank" rel="noopener">Invita su WhatsApp</a>';
      NX.toast("Campo prenotato.");
      if (corrente === "campi") NX.vista($("#c-tab"), tabellone()), segCampo();
      else mostra(false);
    });
  }
  function disdici(id) {
    var p = st.pren.filter(function (x) { return x.id === id; })[0]; if (!p) return;
    var f = NX.foglio.apri({ titolo: "Disdire la prenotazione?", html: "<p style=\"margin:0\"><b>" + esc(p.n) + "</b>, " + p.quando + " alle " + p.ora + "." + (p.corso ? " L'ingresso torna nel tuo abbonamento." : " Il campo torna libero per gli altri.") + "</p>", piede: '<button type="button" class="nx-btn" data-chiudi>Tienila</button><button type="button" class="nx-btn p" id="d-si" style="background:var(--nx-no)">Disdici</button>' });
    f.querySelector("[data-chiudi]").addEventListener("click", function () { NX.foglio.chiudi(f); });
    f.querySelector("#d-si").addEventListener("click", function () {
      st.pren = st.pren.filter(function (x) { return x.id !== id; }); if (p.corso) st.ingressi++; salva();
      NX.foglio.chiudi(f); mostra(false); NX.toast("Prenotazione disdetta.");
    });
  }

  /* ---------- eventi ---------- */
  d.addEventListener("click", function (e) {
    var t = e.target;
    if (t.closest("[data-opzioni]")) { opzioni(); return; }
    var az = t.closest("[data-nx-azione]");
    if (az && box.contains(az)) { location.hash = "#/" + az.getAttribute("data-nx-azione"); return; }
    var b = t.closest("button"); if (!b || !box.contains(b)) return;
    if (b.dataset.g) { sel.g = +b.dataset.g; $$("[data-g]", box).forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); }); NX.vista($("#c-tab"), tabellone()); segCampo(); }
    else if (b.dataset.cg) { cg = +b.dataset.cg; $$("[data-cg]", box).forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); }); NX.vista($("#c-corsi"), listaCorsi()); }
    else if (b.dataset.slot) { var s = b.dataset.slot.split("|"); foglioCampo(+s[0], +s[1], +s[2]); }
    else if (b.dataset.iscrivi) {
      var c = byId(b.dataset.iscrivi); if (st.ingressi < 1) { NX.toast("Ingressi finiti: rinnova l'abbonamento alla reception.", "no"); return; }
      var ts = giorno(cg); var hm = c.ora.split(":"); ts.setHours(+hm[0], +hm[1], 0, 0);
      st.pren.push({ id: "p" + Date.now().toString(36), n: c.n, ora: c.ora, quando: gTesto(cg), corso: c.id, k: cg, ts: ts.getTime() }); st.ingressi--;
      salva(); NX.toast("Posto prenotato: " + c.n + "."); mostra(false);
    }
    else if (b.dataset.disdici) disdici(b.dataset.disdici);
  });
  window.addEventListener("hashchange", function () { NX.foglio.chiudi(); mostra(true); window.scrollTo(0, 0); });

  applicaStile();
  NX.titoloGrande($("#x-nb"));
  mostra(false);
})();
