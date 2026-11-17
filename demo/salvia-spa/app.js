/* Salvia - app dimostrativa sopra il kit Noxford. Nessun dato viene inviato: appuntamenti e scelte restano nel browser. */
(function () {
  "use strict";
  var d = document, esc = NX.esc;
  var $ = function (s, r) { return (r || d).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); };
  var mem = {
    get: function (k, def) { try { var v = localStorage.getItem("salvia-" + k); return v ? JSON.parse(v) : def; } catch (e) { return def; } },
    set: function (k, v) { try { localStorage.setItem("salvia-" + k, JSON.stringify(v)); } catch (e) {} }
  };

  /* ---------- preferenze: ?stile=a|b|c, ?tema=chiaro|scuro, ?vetro=si|no ---------- */
  var q = new URLSearchParams(location.search);
  var stile = /^[abc]$/.test(q.get("stile") || "") ? q.get("stile") : "a";
  var STILI = [["a", "Classico", "Liste raggruppate come nelle Impostazioni di iPhone."], ["b", "Editoriale", "Foto grandi e titoli importanti, come una rivista."], ["c", "Compatto", "Tutto in vista: orari liberi, riquadri e azioni rapide."]];
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
  var FOGLIA = '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 44C12 32 12 16 24 4c12 12 12 28 0 40zM24 12v32"/></svg>';
  var IC = {
    chev: '<svg class="x-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
    cal: '<svg class="x-ic" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="3"/><path d="M4 10h16M9 3v4M15 3v4"/></svg>'
  };
  var CAT = [["tutti", "Tutti"], ["viso", "Viso"], ["corpo", "Corpo"], ["mani", "Mani e piedi"], ["rituali", "Rituali"]];
  var TR = [
    { id: "pulizia", c: "viso", n: "Pulizia del viso profonda", d: "Vapore, estrazione delicata, maschera e massaggio.", min: 60, p: 55, top: 1, fasi: ["Analisi della pelle con la lente", "Detersione e vapore tiepido", "Pulizia dei pori", "Maschera scelta per la tua pelle", "Massaggio finale e crema"], ok: "Pelli miste e grasse, una volta al mese. Sconsigliata nei giorni dopo il sole forte." },
    { id: "idra", c: "viso", n: "Trattamento idratante", d: "Per la pelle che tira: siero, maschera all'acido ialuronico, massaggio.", min: 50, p: 60, fasi: ["Detersione", "Esfoliazione leggera", "Siero e maschera idratante", "Massaggio viso e collo"], ok: "Pelli secche o stanche, anche in inverno." },
    { id: "pietre", c: "corpo", n: "Massaggio con pietre calde", d: "Pietre di basalto e olio caldo su schiena, gambe e piedi.", min: 75, p: 85, img: "img/pietre.webp", top: 1, fasi: ["Due parole su come stai", "Olio caldo e pietre lungo la schiena", "Gambe e piedi", "Dieci minuti di riposo con una tisana"], ok: "Tensioni e stanchezza. Da evitare in gravidanza." },
    { id: "drenante", c: "corpo", n: "Massaggio drenante", d: "Manualità lente per gambe leggere.", min: 50, p: 60, fasi: ["Spazzolatura a secco", "Massaggio dal piede in su", "Crema fresca alle gambe"], ok: "Ritenzione di liquidi e gambe pesanti." },
    { id: "presso", c: "corpo", n: "Pressoterapia", d: "Gambali a pressione per la circolazione.", min: 40, p: 35, fasi: ["Misura delle gambe", "Seduta con i gambali", "Crema drenante"], ok: "Meglio in carnet da 10 sedute. Non adatta con problemi di circolazione: chiedici prima." },
    { id: "semi", c: "mani", n: "Manicure con semipermanente", d: "Cuticole, limatura e colore che dura tre settimane.", min: 60, p: 35, img: "img/manicure.webp", top: 1, fasi: ["Rimozione del colore precedente", "Cuticole e forma", "Base, colore e lucido", "Olio per le cuticole"], ok: "Scegli il colore in cabina: abbiamo più di cento tinte." },
    { id: "pedi", c: "mani", n: "Pedicure estetica", d: "Pediluvio, cuticole, levigatura e smalto.", min: 50, p: 40, fasi: ["Pediluvio con sali", "Cuticole e unghie", "Levigatura del tallone", "Crema e smalto"], ok: "Per problemi alle unghie serve il podologo: te lo indichiamo noi." },
    { id: "rituale", c: "rituali", n: "Rituale Salvia", d: "Scrub al sale, massaggio rilassante e trattamento viso breve.", min: 110, p: 120, img: "img/cabina.webp", top: 1, fasi: ["Tisana di benvenuto", "Scrub al sale e oli", "Massaggio rilassante di 50 minuti", "Viso express", "Riposo nella sala relax"], ok: "Il regalo più scelto per compleanni e anniversari." }
  ];
  var OP = [["chiunque", "Prima libera"], ["marta", "Marta"], ["elisa", "Elisa"]];
  var ORARI = ["9:00", "10:00", "11:00", "12:00", "14:30", "15:30", "16:30", "17:30", "18:30"];
  var GG = ["dom", "lun", "mar", "mer", "gio", "ven", "sab"];
  var GGL = ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"];
  var MM = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];

  var st = mem.get("stato2", null) || { appt: [], carnet: 4 };
  if (!Array.isArray(st.appt)) st.appt = [];
  var salva = function () { mem.set("stato2", st); };
  var sel = { tr: "pietre", op: "chiunque", g: null, ora: null };
  var filtro = "tutti";

  var byId = function (id) { return TR.filter(function (t) { return t.id === id; })[0]; };
  var catN = function (c) { return CAT.filter(function (x) { return x[0] === c; })[0][1]; };
  var dur = function (m) { return m >= 60 ? Math.floor(m / 60) + " h" + (m % 60 ? " " + m % 60 + " min" : "") : m + " min"; };
  var giorno = function (k) { var x = new Date(); x.setHours(12, 0, 0, 0); x.setDate(x.getDate() + k); return x; };
  var chiuso = function (k) { var g = giorno(k).getDay(); return g === 0 || g === 1; };
  var oraNum = function (o) { var p = o.split(":"); return +p[0] + (+p[1]) / 60; };
  /* orari occupati: sempre uguali per lo stesso giorno, così la demo è coerente */
  var occupato = function (k, i, op) {
    if (k === 0 && oraNum(ORARI[i]) <= new Date().getHours() + 1) return true;
    var g = giorno(k).getDate(); return ((g * 7 + i * 3 + (op === "elisa" ? 2 : op === "marta" ? 1 : 0)) % 5) < 2;
  };
  var liberi = function (k, op) { return chiuso(k) ? [] : ORARI.filter(function (o, i) { return !occupato(k, i, op); }); };
  var primoGiorno = function () { for (var k = 0; k < 14; k++) if (liberi(k, sel.op).length) return k; return 1; };
  var quando = function (ts) { var x = new Date(ts); return GGL[x.getDay()] + " " + x.getDate() + " " + MM[x.getMonth()]; };
  var futuri = function () { var ora = Date.now() - 864e5; return st.appt.filter(function (a) { return a.ts > ora; }).sort(function (a, b) { return a.ts - b.ts; }); };
  var thumb = function (t) { return '<span class="s-thumb">' + (t.img ? '<img src="' + t.img + '" alt="" loading="lazy" width="104" height="104">' : FOGLIA) + "</span>"; };
  var euro = function (n) { return n + " €"; };

  /* ---------- pezzi comuni ---------- */
  function cellaTr(t) {
    return '<li><a class="nx-cella" href="#/trattamento/' + t.id + '">' + thumb(t) + '<span class="nx-c-tx"><b>' + esc(t.n) + "</b><small>" + dur(t.min) + " · " + catN(t.c) + '</small></span><span class="nx-c-dx"><span class="s-prezzo">' + euro(t.p) + '</span><i class="nx-chev"></i></span></a></li>';
  }
  function cartaEd(t) {
    return '<a class="s-ed-c" href="#/trattamento/' + t.id + '" data-nx-premi>' + (t.img ? '<div class="x-foto"><img src="' + t.img + '" alt="" loading="lazy" width="800" height="550"></div>' : '<div class="s-pan"><span>' + catN(t.c) + "</span>" + FOGLIA + "</div>") +
      "<h3>" + esc(t.n) + "</h3><p>" + esc(t.d) + '</p><div class="s-ed-m"><span>' + dur(t.min) + "</span><span>" + euro(t.p) + "</span></div></a>";
  }
  function tile(t) {
    return '<div class="x-card s-tile"><span class="nx-pill acc">' + catN(t.c) + '</span><a href="#/trattamento/' + t.id + '" style="color:inherit;text-decoration:none"><b>' + esc(t.n) + "</b></a><small>" + dur(t.min) + '</small><div class="s-tile-p"><span class="s-prezzo">' + euro(t.p) + '</span><a class="nx-btn p" href="#/prenota/' + t.id + '">Prenota</a></div></div>';
  }
  function dataBox(ts) { var x = new Date(ts); return '<span class="s-data"><small>' + GG[x.getDay()] + "</small><b>" + x.getDate() + "</b></span>"; }
  function prossimo() {
    var a = futuri()[0];
    if (!a) return "";
    return '<a class="x-card s-next" href="#/agenda" data-nx-premi>' + dataBox(a.ts) + '<span class="t"><b>' + esc(a.n) + "</b><small>" + quando(a.ts) + ", alle " + a.ora + " con " + esc(a.op) + '</small></span><i class="nx-chev"></i></a>';
  }
  function carnet() {
    return '<div class="x-card s-carnet"><b>Carnet pressoterapia</b><div class="s-barra" role="progressbar" aria-valuemin="0" aria-valuemax="10" aria-valuenow="' + st.carnet + '" aria-label="Sedute usate"><i style="width:' + st.carnet * 10 + '%"></i></div><small>' + st.carnet + " sedute usate su 10 · ne restano " + (10 - st.carnet) + ' · <a href="#/prenota/presso">prenota la prossima</a></small></div>';
  }
  function primiLiberi(n) {
    var out = [];
    for (var k = 0; k < 14 && out.length < n; k++) liberi(k, "chiunque").forEach(function (o) { if (out.length < n) out.push([k, o]); });
    return out;
  }

  /* ---------- viste ---------- */
  var titolo = "";
  function vHome() {
    titolo = stile === "c" ? "Oggi" : "Salvia";
    var top = TR.filter(function (t) { return t.top; });
    if (stile === "b") {
      return '<div class="x-foto s-hero-b"><img src="img/cabina.webp" width="896" height="1200" alt="Cabina per massaggi con lettino coperto di lino, pareti verde salvia, candele e una tenda chiara" fetchpriority="high"><div class="x-foto-tx"><h1>Un\'ora solo per te.</h1><p>Prenoti in tre tocchi e vedi subito gli orari liberi.</p><a class="nx-btn" href="#/prenota">Trova un orario</a></div></div>' +
        (futuri().length ? '<h2 class="x-sez">Ti aspettiamo</h2>' + prossimo() : "") +
        '<h2 class="x-sez">I più richiesti</h2><div class="s-ed">' + top.map(cartaEd).join("") + "</div>" +
        '<div class="x-foto s-gift-b"><img src="img/pietre.webp" width="1024" height="1024" alt="Pietre nere levigate, un asciugamano arrotolato, eucalipto e boccette d\'olio" loading="lazy"><div class="x-foto-tx"><h2>Regala un trattamento</h2><p>Buono da 50, 80 o 120 €, valido un anno.</p><button type="button" class="nx-btn" data-buono>Prepara il buono</button></div></div>';
    }
    if (stile === "c") {
      var a = futuri()[0];
      return '<div class="s-kpi"><a class="x-card" href="#/agenda"><small>Prossimo</small><b>' + (a ? GG[new Date(a.ts).getDay()] + " " + new Date(a.ts).getDate() : "Nessuno") + "</b><small>" + (a ? a.ora + " · " + esc(a.n) : "Prenota quando vuoi") + '</small></a><a class="x-card" href="#/agenda"><small>Carnet</small><b>' + (10 - st.carnet) + "/10</b><small>sedute rimaste</small></a></div>" +
        '<div class="x-sez-r"><h2 class="x-sez">Primi orari liberi</h2><a href="#/prenota">Tutti</a></div><div class="s-slot">' + primiLiberi(8).map(function (s) { var x = giorno(s[0]); return '<button type="button" data-slot="' + s[0] + "|" + s[1] + '"><b>' + s[1] + "</b><small>" + (s[0] === 0 ? "oggi" : s[0] === 1 ? "domani" : GG[x.getDay()] + " " + x.getDate()) + "</small></button>"; }).join("") + "</div>" +
        '<h2 class="x-sez">Trattamenti</h2><div class="s-griglia">' + TR.map(tile).join("") + "</div>" +
        '<h2 class="x-sez">Regala un trattamento</h2><button type="button" class="x-card s-gift" data-buono data-nx-premi><img src="img/pietre.webp" alt="" width="152" height="152" loading="lazy"><span><b>Buono regalo</b><small>Da 50, 80 o 120 €, vale un anno</small></span><i class="nx-chev"></i></button>';
    }
    return '<div class="x-foto s-hero-a"><img src="img/cabina.webp" width="896" height="1200" alt="Cabina per massaggi con lettino coperto di lino, pareti verde salvia, candele e una tenda chiara" fetchpriority="high"><div class="x-foto-tx"><h2>Un\'ora solo per te.</h2><p>Prenoti in tre tocchi e vedi subito gli orari liberi.</p></div></div>' +
      (prossimo() || '<a class="x-card s-next" href="#/prenota" data-nx-premi><span class="s-data">' + IC.cal.replace("x-ic", "x-ic") + '</span><span class="t"><b>Primo orario libero</b><small>' + (function () { var s = primiLiberi(1)[0]; return s ? (s[0] === 0 ? "oggi" : s[0] === 1 ? "domani" : quando(giorno(s[0]).getTime())) + " alle " + s[1] : "nei prossimi giorni"; })() + '</small></span><i class="nx-chev"></i></a>') +
      '<h2 class="x-sez">I più richiesti</h2><ul class="nx-lista">' + top.map(cellaTr).join("") + "</ul>" +
      '<h2 class="x-sez">Regala un trattamento</h2><button type="button" class="x-card s-gift" data-buono data-nx-premi><img src="img/pietre.webp" alt="" width="152" height="152" loading="lazy"><span><b>Buono regalo</b><small>Da 50, 80 o 120 €, vale un anno</small></span><i class="nx-chev"></i></button>';
  }
  function listaTr() {
    var l = TR.filter(function (t) { return filtro === "tutti" || t.c === filtro; });
    if (!l.length) return NX.stato.vuoto("Nessun trattamento", "In questa categoria non c'è ancora nulla.", ["Mostra tutti", "tutti"]);
    if (stile === "b") return '<div class="s-ed">' + l.map(cartaEd).join("") + "</div>";
    if (stile === "c") return '<div class="s-griglia">' + l.map(tile).join("") + "</div>";
    if (filtro !== "tutti") return '<ul class="nx-lista">' + l.map(cellaTr).join("") + "</ul>";
    return CAT.slice(1).map(function (c) { return '<div class="nx-gruppo"><p class="nx-gruppo-t">' + c[1] + '</p><ul class="nx-lista">' + l.filter(function (t) { return t.c === c[0]; }).map(cellaTr).join("") + "</ul></div>"; }).join("");
  }
  function vTrattamenti() {
    titolo = "Trattamenti";
    return '<div class="nx-chips" role="group" aria-label="Filtra per tipo" style="margin-bottom:16px">' + CAT.map(function (c) { return '<button type="button" class="nx-chip" data-f="' + c[0] + '" aria-pressed="' + (c[0] === filtro) + '">' + c[1] + "</button>"; }).join("") + '</div><div id="t-lista">' + listaTr() + "</div>";
  }
  function vTrattamento(id) {
    var t = byId(id);
    if (!t) { titolo = "Trattamento"; return NX.stato.errore("Trattamento non trovato", "Il collegamento non è più valido.", ["Vedi i trattamenti", "trattamenti"]); }
    titolo = t.n;
    return '<div class="s-det">' + (t.img ? '<div class="x-foto s-det-img"><img src="' + t.img + '" alt="" width="800" height="600"></div>' : '<div class="s-det-ill">' + FOGLIA + "</div>") +
      '<p class="s-desc">' + esc(t.d) + '</p><div class="s-meta"><span class="nx-pill acc">' + dur(t.min) + '</span><span class="nx-pill acc">' + euro(t.p) + '</span><span class="nx-pill">' + catN(t.c) + "</span></div>" +
      '<h2 class="x-sez">Come si svolge</h2><ol class="x-card s-fasi">' + t.fasi.map(function (f) { return "<li>" + esc(f) + "</li>"; }).join("") + "</ol>" +
      '<p class="s-adatto"><b>A chi è adatto.</b> ' + esc(t.ok) + "</p>" +
      '<a class="nx-btn p pieno x-cta" href="#/prenota/' + t.id + '">Scegli giorno e ora</a></div>';
  }
  function vPrenota(id) {
    titolo = "Prenota";
    if (id && byId(id)) sel.tr = id;
    if (sel.g === null || chiuso(sel.g)) sel.g = primoGiorno();
    return '<label class="nx-campo"><span>Trattamento</span><select id="p-tr">' + TR.map(function (t) { return '<option value="' + t.id + '"' + (t.id === sel.tr ? " selected" : "") + ">" + esc(t.n) + " · " + euro(t.p) + "</option>"; }).join("") + "</select></label>" +
      '<p class="x-lab">Con chi</p><div class="nx-seg pieno" id="p-op" role="group" aria-label="Estetista">' + OP.map(function (o) { return '<button type="button" data-v="' + o[0] + '" aria-pressed="' + (o[0] === sel.op) + '">' + o[1] + "</button>"; }).join("") + "</div>" +
      '<p class="x-lab">Giorno</p><div class="x-giorni" id="p-giorni" role="group" aria-label="Giorno"></div>' +
      '<p class="x-lab">Orari liberi</p><div class="x-orari" id="p-orari" role="group" aria-label="Orario" aria-live="polite"></div>' +
      '<div class="x-riep" id="p-riep" aria-live="polite"></div>' +
      '<button class="nx-btn p pieno x-cta" type="button" id="p-ok">Conferma l\'appuntamento</button>' +
      '<p class="x-nota">Demo: l\'appuntamento resta solo in questo browser. Nella versione vera arriva nell\'agenda del centro e ricevi un promemoria il giorno prima.</p>';
  }
  function disegnaGiorni() {
    var h = "";
    for (var k = 0; k < 14; k++) {
      var x = giorno(k), c = chiuso(k);
      h += '<button type="button" data-g="' + k + '" aria-pressed="' + (k === sel.g) + '"' + (c ? ' disabled aria-label="' + GGL[x.getDay()] + " " + x.getDate() + ', chiuso"' : ' aria-label="' + GGL[x.getDay()] + " " + x.getDate() + '"') + "><small>" + (k === 0 ? "oggi" : GG[x.getDay()]) + "</small><b>" + x.getDate() + "</b></button>";
    }
    $("#p-giorni").innerHTML = h;
    var att = $('#p-giorni [aria-pressed="true"]'); if (att && att.scrollIntoView && att.offsetLeft > 200) $("#p-giorni").scrollLeft = att.offsetLeft - 16;
  }
  function disegnaOrari(carica) {
    var box = $("#p-orari"); if (!box) return;
    if (carica) {
      box.setAttribute("aria-busy", "true");
      box.innerHTML = ORARI.map(function () { return '<span class="nx-skel"></span>'; }).join("");
      clearTimeout(disegnaOrari.t); disegnaOrari.t = setTimeout(function () { box.removeAttribute("aria-busy"); disegnaOrari(false); }, 260);
      riepilogo(); return;
    }
    var lib = liberi(sel.g, sel.op);
    if (!lib.length) {
      box.innerHTML = '<div style="grid-column:1/-1">' + NX.stato.vuoto("Nessun orario libero", "Questo giorno è pieno con chi hai scelto. Prova con la prima estetista libera o un altro giorno.", ["Giorno dopo", "giorno-dopo"]) + "</div>";
    } else {
      box.innerHTML = ORARI.map(function (o, i) { var occ = occupato(sel.g, i, sel.op); if (occ && sel.ora === o) sel.ora = null; return '<button type="button" data-ora="' + o + '" aria-pressed="' + (sel.ora === o) + '"' + (occ ? ' disabled aria-label="' + o + ', occupato"' : "") + ">" + o + "</button>"; }).join("");
    }
    riepilogo();
  }
  function riepilogo() {
    var t = byId(sel.tr), op = OP.filter(function (o) { return o[0] === sel.op; })[0];
    $("#p-riep").innerHTML = sel.ora ? '<p class="g">' + esc(t.n) + "</p><p>" + quando(giorno(sel.g).getTime()) + " alle " + sel.ora + " · " + dur(t.min) + "</p><p>" + (sel.op === "chiunque" ? "Con la prima estetista libera" : "Con " + op[1]) + " · <b>" + euro(t.p) + "</b>, si paga in centro</p>" : "<p>Scegli un orario libero per vedere il riepilogo.</p>";
    $("#p-ok").disabled = !sel.ora;
  }
  function vAgenda() {
    titolo = "Agenda";
    var f = futuri();
    var h = f.length ? '<ul class="nx-lista s-ag">' + f.map(function (a) {
      return '<li><div class="nx-cella">' + dataBox(a.ts) + '<span class="nx-c-tx"><b>' + esc(a.n) + "</b><small>alle " + a.ora + " con " + esc(a.op) + '</small></span><button type="button" class="nx-btn t r" data-annulla="' + a.id + '">Annulla</button></div></li>';
    }).join("") + "</ul>" : '<div class="x-card">' + NX.stato.vuoto("Nessun appuntamento in programma", "Scegli un trattamento e un orario libero: lo ritrovi qui.", ["Prenota", "prenota"]) + "</div>";
    return h + '<h2 class="x-sez">Il tuo carnet</h2>' + carnet() +
      '<h2 class="x-sez">Già fatti</h2><ul class="nx-lista s-ag">' +
      [["Manicure con semipermanente", "Elisa", 18], ["Pulizia del viso profonda", "Marta", 47]].map(function (e) {
        var ts = Date.now() - e[2] * 864e5;
        return '<li><div class="nx-cella">' + dataBox(ts) + '<span class="nx-c-tx"><b>' + e[0] + "</b><small>con " + e[1] + ' · esempio</small></span><a class="nx-btn t" href="#/prenota/' + (e[0][0] === "M" ? "semi" : "pulizia") + '">Rifai</a></div></li>';
      }).join("") + "</ul>" +
      '<p class="x-nota">Gli appuntamenti nuovi restano solo in questo browser. Carnet e storico sono di esempio.</p>';
  }

  /* ---------- router ---------- */
  var V = {
    home: { tab: "home", r: vHome, noTit: function () { return stile === "b"; } },
    trattamenti: { tab: "trattamenti", r: vTrattamenti },
    trattamento: { tab: "trattamenti", r: vTrattamento, back: ["#/trattamenti", "Trattamenti"] },
    prenota: { tab: "prenota", r: vPrenota, dopo: function () { NX.seg($("#p-op"), function (v) { sel.op = v; disegnaOrari(true); }); disegnaGiorni(); disegnaOrari(false); } },
    agenda: { tab: "agenda", r: vAgenda }
  };
  var ORD = ["home", "trattamenti", "trattamento", "prenota", "agenda"], corrente = null;
  var box = $("#x-vista");
  function mostra(anim) {
    var p = location.hash.replace(/^#\/?/, "").split("/"), n = V[p[0]] ? p[0] : "home", v = V[n];
    var html = v.r(p[1] ? decodeURIComponent(p[1]) : "");
    var verso = corrente && ORD.indexOf(n) < ORD.indexOf(corrente) ? "sx" : "dx";
    if (anim) NX.vista(box, html, verso); else box.innerHTML = html;
    $("#x-tit").textContent = titolo; $("#x-pic").textContent = titolo;
    $("#x-nb-sx").innerHTML = v.back ? '<a class="nx-btn t x-back" href="' + v.back[0] + '">' + IC.chev + v.back[1] + "</a>" : "";
    d.body.classList.toggle("x-no-tit", !!(v.noTit && v.noTit()));
    $$("#x-tab a").forEach(function (a) { if (a.getAttribute("data-tab") === v.tab) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
    d.title = (n === "home" ? "Salvia · Centro estetico e spa" : titolo + " · Salvia") + " (app dimostrativa)";
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
        '<p class="x-nota">Attività inventata, dati di esempio. Le scelte restano solo in questo browser.</p>'
    });
    NX.seg(f.querySelector("#o-stile"), function (v) {
      stile = v; applicaStile(); scriviUrl(); mostra(true);
      f.querySelector("#o-desc").textContent = STILI.filter(function (s) { return s[0] === stile; })[0][2];
    });
    NX.pref.collega(f.querySelector(".o-t"), "tema");
    NX.pref.collega(f.querySelector(".o-v"), "vetro");
  }
  function buono() {
    var imp = "80";
    var f = NX.foglio.apri({
      titolo: "Buono regalo",
      html: '<div class="nx-campo"><span>Importo</span><div class="nx-seg pieno" id="b-imp" role="group" aria-label="Importo del buono"><button type="button" data-v="50" aria-pressed="false">50 €</button><button type="button" data-v="80" aria-pressed="true">80 €</button><button type="button" data-v="120" aria-pressed="false">120 €</button></div><small>Vale un anno su tutti i trattamenti.</small></div>' +
        '<label class="nx-campo"><span>Per chi è</span><input id="b-per" autocomplete="off" maxlength="40" placeholder="Es. Giulia"></label>' +
        '<label class="nx-campo"><span>Due righe sul biglietto (facoltativo)</span><textarea id="b-msg" rows="3" maxlength="200" placeholder="Es. Buon compleanno, prenditi un\'ora per te"></textarea></label>' +
        '<p class="x-err" id="b-err" role="alert"></p>' +
        '<p class="x-nota">Il tasto apre WhatsApp con la richiesta già scritta. Nella versione vera arriva al numero del centro, che ti manda il buono da inoltrare.</p>',
      piede: '<a class="nx-btn p" id="b-ok" href="#" target="_blank" rel="noopener">Chiedi il buono su WhatsApp</a>'
    });
    var per = f.querySelector("#b-per"), msg = f.querySelector("#b-msg"), ok = f.querySelector("#b-ok"), err = f.querySelector("#b-err");
    function link() {
      var t = "Ciao Salvia, vorrei un buono regalo da " + imp + " € per " + (per.value.trim() || "...") + "." + (msg.value.trim() ? "\nSul biglietto: \"" + msg.value.trim() + "\"" : "") + "\nCome lo posso pagare?";
      ok.href = "https://wa.me/?text=" + encodeURIComponent(t);
    }
    NX.seg(f.querySelector("#b-imp"), function (v) { imp = v; link(); });
    per.addEventListener("input", function () { err.textContent = ""; link(); });
    msg.addEventListener("input", link);
    ok.addEventListener("click", function (e) {
      if (!per.value.trim()) { e.preventDefault(); err.textContent = "Scrivi per chi è il buono."; per.focus(); return; }
      NX.toast("WhatsApp aperto con la richiesta pronta.");
      setTimeout(function () { NX.foglio.chiudi(f); }, 300);
    });
    link();
  }
  function annulla(id) {
    var a = st.appt.filter(function (x) { return x.id === id; })[0]; if (!a) return;
    var f = NX.foglio.apri({
      titolo: "Annullare l'appuntamento?",
      html: "<p style=\"margin:0 0 6px\"><b>" + esc(a.n) + "</b></p><p style=\"margin:0;color:var(--nx-tx2)\">" + quando(a.ts) + " alle " + a.ora + ". L'orario torna libero per altre persone.</p>",
      piede: '<button type="button" class="nx-btn" data-chiudi>Tienilo</button><button type="button" class="nx-btn p" id="a-si" style="background:var(--nx-no)">Annulla</button>'
    });
    f.querySelector("[data-chiudi]").addEventListener("click", function () { NX.foglio.chiudi(f); });
    f.querySelector("#a-si").addEventListener("click", function () {
      st.appt = st.appt.filter(function (x) { return x.id !== id; }); salva();
      NX.foglio.chiudi(f); mostra(false); NX.toast("Appuntamento annullato.");
    });
  }

  /* ---------- eventi ---------- */
  d.addEventListener("click", function (e) {
    var t = e.target;
    if (t.closest("[data-opzioni]")) { opzioni(); return; }
    if (t.closest("[data-buono]")) { buono(); return; }
    var az = t.closest("[data-nx-azione]");
    if (az && box.contains(az)) {
      var k = az.getAttribute("data-nx-azione");
      if (k === "tutti") { filtro = "tutti"; mostra(false); }
      else if (k === "giorno-dopo") { var g = sel.g + 1; while (chiuso(g) && g < 20) g++; sel.g = g; sel.ora = null; disegnaGiorni(); disegnaOrari(true); }
      else location.hash = "#/" + k;
      return;
    }
    var b = t.closest("button"); if (!b || !box.contains(b)) return;
    if (b.dataset.f) { filtro = b.dataset.f; $$(".nx-chip", box).forEach(function (c) { c.setAttribute("aria-pressed", c === b ? "true" : "false"); }); NX.vista($("#t-lista"), listaTr()); }
    else if (b.dataset.g) { sel.g = +b.dataset.g; sel.ora = null; disegnaGiorni(); disegnaOrari(true); }
    else if (b.dataset.ora) { sel.ora = b.dataset.ora; $$("#p-orari button").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); }); riepilogo(); }
    else if (b.dataset.slot) { var s = b.dataset.slot.split("|"); sel.g = +s[0]; sel.ora = s[1]; sel.op = "chiunque"; location.hash = "#/prenota"; }
    else if (b.dataset.annulla) annulla(b.dataset.annulla);
    else if (b.id === "p-ok" && sel.ora) {
      var tr = byId(sel.tr), op = sel.op === "chiunque" ? (sel.g % 2 ? "Marta" : "Elisa") : OP.filter(function (o) { return o[0] === sel.op; })[0][1];
      var ts = giorno(sel.g); var hm = sel.ora.split(":"); ts.setHours(+hm[0], +hm[1], 0, 0);
      st.appt.push({ id: "a" + Date.now().toString(36), tr: tr.id, n: tr.n, ts: ts.getTime(), ora: sel.ora, op: op, p: tr.p });
      salva(); sel.ora = null;
      NX.toast("Appuntamento salvato: " + quando(ts.getTime()) + " alle " + st.appt[st.appt.length - 1].ora + ".");
      location.hash = "#/agenda";
    }
  });
  d.addEventListener("change", function (e) { if (e.target.id === "p-tr") { sel.tr = e.target.value; riepilogo(); } });
  window.addEventListener("hashchange", function () { NX.foglio.chiudi(); mostra(true); window.scrollTo(0, 0); });

  applicaStile();
  NX.titoloGrande($("#x-nb"));
  mostra(false);
})();
