/* Studio Sorriso Chiaro - app dimostrativa sopra il kit Noxford. Nessun dato viene inviato: tutto resta nel browser. */
(function () {
  "use strict";
  var d = document, esc = NX.esc;
  var $ = function (s, r) { return (r || d).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); };
  var mem = {
    get: function (k, def) { try { var v = localStorage.getItem("sorriso-" + k); return v ? JSON.parse(v) : def; } catch (e) { return def; } },
    set: function (k, v) { try { localStorage.setItem("sorriso-" + k, JSON.stringify(v)); } catch (e) {} }
  };

  /* ---------- preferenze: ?stile=a|b|c, ?tema=chiaro|scuro, ?vetro=si|no ---------- */
  var q = new URLSearchParams(location.search);
  var stile = /^[abc]$/.test(q.get("stile") || "") ? q.get("stile") : "a";
  var STILI = [["a", "Classico", "Liste raggruppate come nelle Impostazioni di iPhone."], ["b", "Editoriale", "Foto dello studio in grande e schede ampie."], ["c", "Compatto", "Cruscotto con i numeri del tuo piano e azioni rapide."]];
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
  var DENTE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4c2 0 3 1 4 1s2-1 4-1c2.5 0 3.5 2.5 3 5-.5 3-1.3 4-1.8 7.5-.3 2-2.2 2-2.5 0l-.7-3.5c-.3-1.3-1.7-1.3-2 0l-.7 3.5c-.3 2-2.2 2-2.5 0C8.3 13 7.5 12 7 9c-.5-2.5.5-5 1-5z"/></svg>';
  var IC = {
    chev: '<svg class="x-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
    cal: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/></svg>',
    doc: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h3"/></svg>',
    bell: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 20h4"/></svg>'
  };
  var GG = ["dom", "lun", "mar", "mer", "gio", "ven", "sab"], GGL = ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"];
  var MM = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];
  var giorno = function (k) { var x = new Date(); x.setHours(12, 0, 0, 0); x.setDate(x.getDate() + k); return x; };
  var SERV = [
    { id: "igiene", n: "Igiene e pulizia", d: "Ablazione del tartaro, lucidatura e consigli su misura.", min: 45, p: "da 80 €", img: "img/studio.webp", dom: [["Fa male?", "Di solito no. Se hai denti sensibili usiamo un gel che addormenta la gengiva."], ["Ogni quanto?", "Per la maggior parte delle persone ogni sei mesi."]] },
    { id: "visita", n: "Prima visita", d: "Controllo completo, radiografia se serve e preventivo scritto.", min: 40, p: "50 €", img: "img/attesa.webp", dom: [["Cosa porto?", "Tessera sanitaria, eventuali radiografie recenti e l'elenco dei farmaci che prendi."], ["Il preventivo è vincolante?", "No. Te lo diamo scritto e hai tutto il tempo per decidere."]] },
    { id: "allineatori", n: "Allineatori trasparenti", d: "Mascherine quasi invisibili per raddrizzare i denti, anche da adulti.", min: 60, p: "su preventivo", dom: [["Quanto dura?", "Dipende dal caso: in genere da 8 a 18 mesi."], ["Si vedono?", "Molto poco. Si tolgono per mangiare e lavare i denti."]] },
    { id: "impianti", n: "Implantologia", d: "Sostituzione di uno o più denti con impianti in titanio.", min: 90, p: "su preventivo", dom: [["Posso pagare a rate?", "Sì, il piano di cura si può dividere in rate senza interessi."], ["Quanto ci vuole?", "Dalla chirurgia alla corona passano di solito tre o quattro mesi."]] },
    { id: "sbiancamento", n: "Sbiancamento", d: "In studio in una seduta, oppure a casa con le mascherine.", min: 75, p: "da 250 €", dom: [["È sicuro?", "Sì, se fatto dopo un'igiene e su denti sani. Prima facciamo sempre un controllo."]] },
    { id: "bambini", n: "Dentista per bambini", d: "Prime visite dai 3 anni, sigillature e controlli con calma.", min: 30, p: "da 40 €", dom: [["Quando la prima visita?", "Verso i 3 anni, anche solo per prendere confidenza con lo studio."]] }
  ];
  var MOTIVI = [["igiene", "Igiene"], ["visita", "Controllo"], ["dolore", "Ho dolore"], ["allineatori", "Allineatori"]];
  var ORARI = ["9:00", "9:45", "10:30", "11:15", "12:00", "15:00", "15:45", "16:30", "17:15", "18:00"];
  var PROM = [
    { id: "igiene6", n: "Igiene ogni 6 mesi", d: "Ti scriviamo un mese prima della scadenza. Ultima igiene: 12 maggio.", on: true },
    { id: "appt", n: "Il giorno prima di ogni appuntamento", d: "Messaggio alle 18 con orario e indirizzo.", on: true },
    { id: "spazzolino", n: "Cambio dello spazzolino", d: "Ogni tre mesi.", on: false },
    { id: "rate", n: "Scadenza delle rate", d: "Tre giorni prima di ogni rata del piano di cura.", on: false }
  ];
  var FASI = [["Visita e radiografie", "2 ottobre", 1], ["Inserimento dell'impianto", "16 ottobre", 1], ["Controllo della guarigione", "27 novembre", 0], ["Impronta digitale", "gennaio", 0], ["Corona definitiva", "febbraio", 0]];
  var RATE = [480, 480, 480, 480, 480], MESIR = ["ottobre", "novembre", "dicembre", "gennaio", "febbraio"];
  var st = mem.get("stato2", null) || { appt: null, prom: PROM.reduce(function (o, p) { o[p.id] = p.on; return o; }, {}), pagate: 2 };
  var salva = function () { mem.set("stato2", st); };
  var sel = { m: "igiene", g: null, ora: null };
  var byId = function (id) { return SERV.filter(function (s) { return s.id === id; })[0]; };
  var aperto = function (k) { var g = giorno(k).getDay(); return g !== 0 && g !== 6; };
  var occupato = function (k, i) { return ((giorno(k).getDate() * 3 + i * 5) % 7) < 3 && !(sel.m === "dolore" && i === 4); };
  var quando = function (ts) { var x = new Date(ts); return GGL[x.getDay()] + " " + x.getDate() + " " + MM[x.getMonth()]; };
  var nProm = function () { return Object.keys(st.prom).filter(function (k) { return st.prom[k]; }).length; };
  var pagato = function () { return RATE.slice(0, st.pagate).reduce(function (a, b) { return a + b; }, 0); };
  var mig = function (n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " €"; };
  var fase = function () { for (var i = 0; i < FASI.length; i++) if (!FASI[i][2]) return i; return FASI.length - 1; };
  var waLink = function (t) { return "https://wa.me/?text=" + encodeURIComponent(t); };

  /* prossimo appuntamento: la richiesta fatta in app, se c'è, altrimenti il controllo del piano di cura */
  function prossimo() {
    var a = st.appt;
    if (a) return { tit: quando(a.data) + ", " + a.ora, sub: a.m + " · " + (a.note ? "con una nota per lo studio" : "Studio Sorriso Chiaro"), pill: ["wait", "In attesa di conferma"], et: "Richiesta inviata" };
    return { tit: "venerdì 27 novembre, 15:45", sub: "Controllo della guarigione · Dott.ssa Neri", pill: ["ok", "Confermato"], et: "Prossimo appuntamento" };
  }
  function cartaNext() {
    var p = prossimo();
    return '<a class="x-card o-next" href="#/' + (st.appt ? "prenota" : "piano") + '" data-nx-premi><small>' + p.et + "</small><b>" + p.tit + "</b><span>" + esc(p.sub) + '</span><div class="o-row"><span class="nx-pill ' + p.pill[0] + '">' + p.pill[1] + '</span><span class="nx-pill">Sala 2</span></div></a>';
  }

  /* ---------- viste ---------- */
  var titolo = "";
  function vHome() {
    titolo = "Buongiorno, Paola";
    var cons = '<div class="o-cons"><b>Il consiglio di questa settimana</b><p>Lo spazzolino va cambiato ogni tre mesi, o prima se le setole si aprono. Con le testine elettriche vale lo stesso.</p></div>';
    if (stile === "b") {
      var p = prossimo();
      return '<div class="x-foto o-hero-b"><img src="img/studio.webp" width="1200" height="896" alt="Sala dello studio con poltrona odontoiatrica bianca, mobili verde menta e una grande finestra sul giardino" fetchpriority="high"><div class="x-foto-tx"><h1>Buongiorno, Paola</h1><a class="o-hero-n" href="#/piano"><small>' + p.et + "</small><b>" + p.tit + "</b><small>" + esc(p.sub) + "</small></a></div></div>" +
        '<h2 class="x-sez">Il tuo percorso</h2><a class="x-card o-ed-c" href="#/piano" data-nx-premi><div class="o-ed-p"><span>Piano di cura</span>' + IC.doc + '</div><div class="o-ed-t"><h3>Impianto e corona sul 36</h3><p>Fase ' + (fase() + 1) + " di 5: " + FASI[fase()][0].toLowerCase() + '.</p><div class="o-ed-m"><span>' + st.pagate + " rate su 5 pagate</span></div></div></a>" +
        '<h2 class="x-sez">Lo studio</h2><div class="x-card o-ed-c"><div class="x-foto"><img src="img/attesa.webp" width="1200" height="896" alt="Sala d\'attesa luminosa con poltroncine chiare e piante" loading="lazy"></div><div class="o-ed-t"><h3>Due sale, nessuna fretta</h3><p>Una sala per l\'igiene e una per le cure. Parcheggio interno per i pazienti.</p></div></div>' +
        '<h2 class="x-sez">Da sapere</h2>' + cons;
    }
    if (stile === "c") {
      var pr = prossimo();
      return '<div class="o-kpi"><a class="x-card o-kpi-w" href="#/' + (st.appt ? "prenota" : "piano") + '"><small>' + pr.et + "</small><b>" + pr.tit + "</b><small>" + esc(pr.sub) + '</small></a>' +
        '<a class="x-card" href="#/piano"><small>Rate pagate</small><b>' + st.pagate + ' di 5</b><small>' + mig(pagato()) + ' su 2.400 €</small></a>' +
        '<a class="x-card" href="#/promemoria"><small>Promemoria</small><b>' + nProm() + ' attivi</b><small>su ' + PROM.length + '</small></a>' +
        '<a class="x-card o-kpi-w" href="#/piano"><small>Fase del piano</small><b>' + (fase() + 1) + " di 5 · " + FASI[fase()][0] + "</b><small>previsto il " + FASI[fase()][1] + "</small></a></div>" +
        '<h2 class="x-sez">Azioni rapide</h2><div class="o-azioni"><a class="x-card" href="#/prenota" data-nx-premi><span class="o-ic">' + IC.cal + '</span>Prenota</a><a class="x-card" href="#/prenota/dolore" data-nx-premi><span class="o-ic" style="color:var(--nx-no);background:var(--nx-no-l)">' + DENTE + '</span>Ho dolore</a><a class="x-card" href="#/servizi" data-nx-premi><span class="o-ic">' + DENTE + "</span>Servizi</a></div>" +
        '<h2 class="x-sez">Da sapere</h2>' + cons;
    }
    return cartaNext() +
      '<div class="nx-gruppo" style="margin-top:22px"><ul class="nx-lista">' +
      '<li><a class="nx-cella ic" href="#/prenota"><span class="nx-c-ic">' + IC.cal + '</span><span class="nx-c-tx"><b>Prenota</b><small>visita, igiene o urgenza</small></span><i class="nx-chev"></i></a></li>' +
      '<li><a class="nx-cella ic" href="#/piano"><span class="nx-c-ic">' + IC.doc + '</span><span class="nx-c-tx"><b>Piano di cura</b><small>fase ' + (fase() + 1) + " di 5 · " + st.pagate + ' rate pagate</small></span><i class="nx-chev"></i></a></li>' +
      '<li><a class="nx-cella ic" href="#/promemoria"><span class="nx-c-ic">' + IC.bell + '</span><span class="nx-c-tx"><b>Promemoria</b><small>' + nProm() + (nProm() === 1 ? " attivo" : " attivi") + '</small></span><i class="nx-chev"></i></a></li></ul></div>' +
      '<div class="x-foto o-studio"><img src="img/studio.webp" width="1200" height="896" alt="Sala dello studio con poltrona odontoiatrica bianca, mobili verde menta e una grande finestra sul giardino" loading="lazy"><div class="x-foto-tx"><h2>Lo studio</h2><p>Due sale, una per l\'igiene e una per le cure. Parcheggio interno.</p></div></div>' +
      '<div style="margin-top:16px">' + cons + "</div>";
  }
  function vServizi() {
    titolo = "Cosa facciamo";
    if (stile === "b") return '<div class="o-ed">' + SERV.map(function (s) {
      return '<a class="x-card o-ed-c" href="#/servizio/' + s.id + '" data-nx-premi>' + (s.img ? '<div class="x-foto"><img src="' + s.img + '" alt="" loading="lazy" width="800" height="450"></div>' : '<div class="o-ed-p"><span>' + s.min + " minuti</span>" + DENTE + "</div>") +
        '<div class="o-ed-t"><h3>' + esc(s.n) + "</h3><p>" + esc(s.d) + '</p><div class="o-ed-m"><span>' + s.min + " min</span><span>" + s.p + "</span></div></div></a>";
    }).join("") + "</div>";
    if (stile === "c") return '<div class="o-griglia">' + SERV.map(function (s) {
      var m = MOTIVI.some(function (x) { return x[0] === s.id; }) ? s.id : "visita";
      return '<div class="x-card o-tile"><span class="o-ic">' + DENTE + '</span><a class="o-tl" href="#/servizio/' + s.id + '"><b>' + esc(s.n) + "</b></a><small>" + s.min + " min · " + s.p + '</small><a class="nx-btn p" href="#/prenota/' + m + '">Prenota</a></div>';
    }).join("") + "</div>";
    return '<ul class="nx-lista">' + SERV.map(function (s) {
      return '<li><a class="nx-cella ic" href="#/servizio/' + s.id + '"><span class="nx-c-ic">' + DENTE + '</span><span class="nx-c-tx"><b>' + esc(s.n) + "</b><small>" + s.min + " min · " + s.p + '</small></span><i class="nx-chev"></i></a></li>';
    }).join("") + "</ul>";
  }
  function vServizio(id) {
    var s = byId(id);
    if (!s) { titolo = "Servizio"; return NX.stato.errore("Servizio non trovato", "Il collegamento non è più valido.", ["Vedi i servizi", "servizi"]); }
    titolo = s.n;
    var m = MOTIVI.some(function (x) { return x[0] === s.id; }) ? s.id : "visita";
    return (s.img ? '<div class="x-foto o-det-img"><img src="' + s.img + '" alt="" width="800" height="500"></div>' : '<div class="o-det-ill">' + DENTE + "</div>") +
      '<p class="o-desc">' + esc(s.d) + '</p><div class="o-info"><div class="x-card"><small>Durata</small><b>' + s.min + ' minuti</b></div><div class="x-card"><small>Prezzo</small><b>' + s.p + "</b></div></div>" +
      '<h2 class="x-sez">Le domande che ci fate</h2><ul class="nx-lista o-dom">' + s.dom.map(function (x) { return '<li><div class="nx-cella"><b>' + esc(x[0]) + "</b><span>" + esc(x[1]) + "</span></div></li>"; }).join("") + "</ul>" +
      '<a class="nx-btn p pieno x-cta" href="#/prenota/' + m + '">Prenota</a>';
  }
  function vPrenota(m) {
    titolo = "Prenota";
    if (m && MOTIVI.some(function (x) { return x[0] === m; })) sel.m = m;
    if (sel.g === null || !aperto(sel.g)) { sel.g = 1; while (!aperto(sel.g)) sel.g++; }
    var richiesta = st.appt ? '<div class="x-card" style="padding:14px 16px;margin-bottom:16px;display:flex;gap:12px;align-items:center"><span class="nx-pill wait">In attesa</span><span style="flex:1;min-width:0;font-size:var(--nx-t-s)">' + esc(st.appt.m) + ", " + quando(st.appt.data) + " alle " + st.appt.ora + '</span><button type="button" class="nx-btn t r" id="p-ritira">Ritira</button></div>' : "";
    return richiesta + '<p class="x-lab" style="margin-top:4px">Per cosa</p><div class="nx-chips o-motivi" id="p-motivi" role="group" aria-label="Motivo della visita">' + MOTIVI.map(function (x) { return '<button type="button" class="nx-chip" data-m="' + x[0] + '" aria-pressed="' + (sel.m === x[0]) + '">' + x[1] + "</button>"; }).join("") + "</div>" +
      '<p class="x-lab">Giorno</p><div class="x-giorni" id="p-giorni" role="group" aria-label="Giorno"></div>' +
      '<p class="x-lab">Orario</p><div class="x-orari" id="p-orari" role="group" aria-label="Orario" aria-live="polite"></div>' +
      '<label class="x-lab" for="p-note" style="display:block">Vuoi dirci qualcosa prima?</label><textarea class="o-note" id="p-note" rows="3" maxlength="300" placeholder="Es. sensibilità al freddo da una settimana"></textarea>' +
      '<div class="x-riep" id="p-riep" aria-live="polite"></div>' +
      '<button class="nx-btn p pieno x-cta" type="button" id="p-ok">Richiedi l\'appuntamento</button>' +
      '<p class="x-nota">Demo: la richiesta resta in questo browser e puoi mandarla su WhatsApp con il testo già scritto. Nella versione vera la segreteria conferma entro la giornata.</p>';
  }
  function disegnaGiorni() {
    var h = "";
    for (var k = 1, c = 0; c < 10; k++) { if (!aperto(k)) continue; c++; var x = giorno(k); h += '<button type="button" data-g="' + k + '" aria-pressed="' + (k === sel.g) + '" aria-label="' + GGL[x.getDay()] + " " + x.getDate() + '"><small>' + (k === 1 ? "domani" : GG[x.getDay()]) + "</small><b>" + x.getDate() + "</b></button>"; }
    $("#p-giorni").innerHTML = h;
  }
  function disegnaOrari(carica) {
    var box = $("#p-orari"); if (!box) return;
    if (carica) {
      box.setAttribute("aria-busy", "true");
      box.innerHTML = ORARI.map(function () { return '<span class="nx-skel"></span>'; }).join("");
      clearTimeout(disegnaOrari.t); disegnaOrari.t = setTimeout(function () { box.removeAttribute("aria-busy"); disegnaOrari(false); }, 260);
      riepilogo(); return;
    }
    box.innerHTML = ORARI.map(function (o, i) { var occ = occupato(sel.g, i); if (occ && sel.ora === o) sel.ora = null; return '<button type="button" data-ora="' + o + '" aria-pressed="' + (sel.ora === o) + '"' + (occ ? ' disabled aria-label="' + o + ', occupato"' : "") + ">" + o + "</button>"; }).join("");
    riepilogo();
  }
  function riepilogo() {
    var mot = MOTIVI.filter(function (x) { return x[0] === sel.m; })[0][1];
    $("#p-riep").innerHTML = (sel.m === "dolore" ? '<p style="margin-bottom:8px"><b>Per il dolore teniamo sempre libero un posto alle 12:00.</b> Se è forte, tocca Urgenza in alto.</p>' : "") +
      (sel.ora ? '<p class="g">' + mot + "</p><p>" + quando(giorno(sel.g).getTime()) + " alle " + sel.ora + "</p>" : "<p>Scegli un orario libero per vedere il riepilogo.</p>");
    $("#p-ok").disabled = !sel.ora;
  }
  function vPromemoria() {
    titolo = "Promemoria";
    return '<p class="x-nota" style="margin:0 2px 14px">Ti scriviamo noi quando è il momento. Scegli cosa ricordarti.</p><ul class="nx-lista o-prom">' + PROM.map(function (p) {
      return '<li><label class="nx-cella nx-toggle" style="justify-content:space-between"><span class="nx-c-tx"><b>' + esc(p.n) + "</b><small>" + esc(p.d) + '</small></span><input type="checkbox" data-sw="' + p.id + '"' + (st.prom[p.id] ? " checked" : "") + "><i></i></label></li>";
    }).join("") + "</ul>" +
      (nProm() ? "" : '<div class="x-card" style="margin-top:16px">' + NX.stato.vuoto("Nessun promemoria attivo", "Non ti scriveremo per ricordarti le visite. Puoi riattivarli quando vuoi.") + "</div>") +
      '<p class="x-nota">Nella versione vera i promemoria arrivano per SMS o WhatsApp. Qui le scelte restano solo in questo browser.</p>';
  }
  function vPiano() {
    titolo = "Piano di cura";
    var pg = pagato(), f = fase();
    return '<div class="x-card o-piano"><small>Preventivo accettato il 2 ottobre</small><h2>Impianto e corona sul 36</h2><div class="o-tot"><span>Totale</span><b>2.400 €</b></div><div class="o-barra" role="progressbar" aria-label="Quota pagata" aria-valuemin="0" aria-valuemax="2400" aria-valuenow="' + pg + '"><i style="width:' + Math.round(pg / 2400 * 100) + '%"></i></div><small>Pagati ' + mig(pg) + " su 2.400 € · 5 rate senza interessi</small></div>" +
      '<h2 class="x-sez">Le fasi</h2><ol class="x-card o-fasi">' + FASI.map(function (x, i) { return '<li class="' + (x[2] ? "ok" : i === f ? "ora" : "") + '"><span><b>' + esc(x[0]) + "</b><small>" + (x[2] ? "Fatto il " : i === f ? "Prossimo: " : "Previsto a ") + x[1] + "</small></span></li>"; }).join("") + "</ol>" +
      '<h2 class="x-sez">Le rate</h2><ul class="nx-lista">' + RATE.map(function (r, i) {
        var pag = i < st.pagate;
        return '<li><div class="nx-cella"><span class="nx-c-tx"><b>Rata ' + (i + 1) + " · " + r + " €</b><small>" + (pag ? "Pagata" : "Scade il 5 " + MESIR[i]) + "</small></span>" + (pag ? '<span class="nx-pill ok">Pagata</span>' : i === st.pagate ? '<button type="button" class="nx-btn p" id="paga">Paga</button>' : '<span class="nx-pill">Da pagare</span>') + "</div></li>";
      }).join("") + "</ul>" +
      '<p class="x-nota">Piano, date e importi sono di esempio. Il pagamento non è attivo: il tasto segna solo la rata come pagata.</p>';
  }

  /* ---------- router ---------- */
  var V = {
    home: { tab: "home", r: vHome, noTit: function () { return stile === "b"; } },
    servizi: { tab: "servizi", r: vServizi },
    servizio: { tab: "servizi", r: vServizio, back: ["#/servizi", "Servizi"] },
    prenota: { tab: "prenota", r: vPrenota, dopo: function () { disegnaGiorni(); disegnaOrari(false); } },
    promemoria: { tab: "promemoria", r: vPromemoria },
    piano: { tab: "piano", r: vPiano }
  };
  var ORD = ["home", "servizi", "servizio", "prenota", "promemoria", "piano"], corrente = null;
  var box = $("#x-vista");
  function mostra(anim) {
    var p = location.hash.replace(/^#\/?/, "").split("/"), n = V[p[0]] ? p[0] : "home", v = V[n];
    var html = v.r(p[1] ? decodeURIComponent(p[1]) : "");
    var verso = corrente && ORD.indexOf(n) < ORD.indexOf(corrente) ? "sx" : "dx";
    if (anim) NX.vista(box, html, verso); else box.innerHTML = html;
    $("#x-tit").textContent = titolo; $("#x-pic").textContent = n === "home" ? "Sorriso Chiaro" : titolo;
    $("#x-nb-sx").innerHTML = v.back ? '<a class="nx-btn t x-back" href="' + v.back[0] + '">' + IC.chev + v.back[1] + "</a>" : '<button type="button" class="nx-btn x-urg x-ghost" data-urgenza>Urgenza</button>';
    d.body.classList.toggle("x-no-tit", !!(v.noTit && v.noTit()));
    $$("#x-tab a").forEach(function (a) { if (a.getAttribute("data-tab") === v.tab) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
    d.title = (n === "home" ? "Studio Sorriso Chiaro · App per i pazienti" : titolo + " · Sorriso Chiaro") + " (app dimostrativa)";
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
        '<p class="x-nota">Studio inventato, dati di esempio. Le scelte restano solo in questo browser.</p>'
    });
    NX.seg(f.querySelector("#o-stile"), function (v) {
      stile = v; applicaStile(); scriviUrl(); mostra(true);
      f.querySelector("#o-desc").textContent = STILI.filter(function (s) { return s[0] === stile; })[0][2];
    });
    NX.pref.collega(f.querySelector(".o-t"), "tema");
    NX.pref.collega(f.querySelector(".o-v"), "vetro");
  }
  function urgenza() {
    var testo = "Buongiorno, sono Paola Riva. Ho un'urgenza: [scrivi qui cosa succede, da quando e dove fa male]. Potete ricevermi oggi?";
    NX.foglio.apri({
      titolo: "Urgenza",
      html: '<p style="margin:0 0 12px">Dolore forte, gonfiore o un dente rotto? Ogni giorno teniamo libero un posto alle 12:00 per chi ha un\'urgenza.</p>' +
        '<ul class="nx-lista"><li><div class="nx-cella"><span class="nx-c-tx"><b>Intanto</b><small class="x-wrap-tx">Sciacqua con acqua tiepida, niente impacchi caldi. Se c\'è febbre o gonfiore al viso, dillo subito.</small></span></div></li><li><div class="nx-cella"><span class="nx-c-tx"><b>Di notte e nei festivi</b><small class="x-wrap-tx">Rivolgiti alla guardia medica o al pronto soccorso.</small></span></div></li></ul>' +
        '<p class="x-nota">Nella versione vera c\'è anche il tasto per chiamare lo studio. In questa demo il numero non c\'è: WhatsApp si apre con il messaggio pronto da completare.</p>',
      piede: '<a class="nx-btn" href="#/prenota/dolore">Prenota alle 12:00</a><a class="nx-btn p" href="' + waLink(testo) + '" target="_blank" rel="noopener" id="u-wa">Scrivi su WhatsApp</a>'
    });
  }
  function conferma(r) {
    var testo = "Buongiorno, sono Paola Riva. Vorrei un appuntamento per: " + r.m + ".\nGiorno: " + quando(r.data) + " alle " + r.ora + "." + (r.note ? "\nNota: " + r.note : "") + "\nGrazie!";
    var f = NX.foglio.apri({
      titolo: "Richiesta pronta",
      html: '<p style="margin:0 0 6px"><b>' + esc(r.m) + "</b>, " + quando(r.data) + " alle " + r.ora + '.</p><p style="margin:0;color:var(--nx-tx2)">La trovi in Home come «in attesa di conferma». Vuoi mandarla anche su WhatsApp? Il testo è già scritto.</p>',
      piede: '<button type="button" class="nx-btn" data-chiudi>Va bene così</button><a class="nx-btn p" id="c-wa" href="' + waLink(testo) + '" target="_blank" rel="noopener">Manda su WhatsApp</a>'
    });
    f.querySelector("[data-chiudi]").addEventListener("click", function () { NX.foglio.chiudi(f); });
    f.querySelector("#c-wa").addEventListener("click", function () { NX.toast("WhatsApp aperto con la richiesta pronta."); });
  }

  /* ---------- eventi ---------- */
  d.addEventListener("click", function (e) {
    var t = e.target;
    if (t.closest("[data-opzioni]")) { opzioni(); return; }
    if (t.closest("[data-urgenza]")) { urgenza(); return; }
    var az = t.closest("[data-nx-azione]");
    if (az && box.contains(az)) { location.hash = "#/" + az.getAttribute("data-nx-azione"); return; }
    var b = t.closest("button"); if (!b || !box.contains(b)) return;
    if (b.dataset.m) { sel.m = b.dataset.m; $$("#p-motivi button").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); }); disegnaOrari(false); }
    else if (b.dataset.g) { sel.g = +b.dataset.g; sel.ora = null; disegnaGiorni(); disegnaOrari(true); }
    else if (b.dataset.ora) { sel.ora = b.dataset.ora; $$("#p-orari button").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); }); riepilogo(); }
    else if (b.id === "p-ritira") { st.appt = null; salva(); mostra(false); NX.toast("Richiesta ritirata."); }
    else if (b.id === "paga") {
      var f = NX.foglio.apri({ titolo: "Rata " + (st.pagate + 1) + " · 480 €", html: '<p style="margin:0">In questa demo non si paga davvero: il tasto segna la rata come pagata. Nella versione vera qui c\'è il pagamento con carta o il bonifico con la causale già scritta.</p>', piede: '<button type="button" class="nx-btn" data-chiudi>Annulla</button><button type="button" class="nx-btn p" id="paga-si">Segna come pagata</button>' });
      f.querySelector("[data-chiudi]").addEventListener("click", function () { NX.foglio.chiudi(f); });
      f.querySelector("#paga-si").addEventListener("click", function () { st.pagate = Math.min(5, st.pagate + 1); salva(); NX.foglio.chiudi(f); mostra(false); NX.toast("Rata segnata come pagata (demo)."); });
    }
    else if (b.id === "p-ok" && sel.ora) {
      var r = { data: giorno(sel.g).getTime(), ora: sel.ora, m: MOTIVI.filter(function (x) { return x[0] === sel.m; })[0][1], note: ($("#p-note").value || "").trim() };
      st.appt = r; salva(); sel.ora = null;
      location.hash = "#/home"; setTimeout(function () { conferma(r); }, 80);
    }
  });
  d.addEventListener("change", function (e) {
    var s = e.target.getAttribute && e.target.getAttribute("data-sw"); if (!s) return;
    st.prom[s] = e.target.checked; salva();
    NX.toast(e.target.checked ? "Promemoria attivato." : "Promemoria spento.");
    if (!nProm() || (nProm() === 1 && e.target.checked)) mostra(false);
  });
  window.addEventListener("hashchange", function () { NX.foglio.chiudi(); mostra(true); window.scrollTo(0, 0); });

  applicaStile();
  NX.titoloGrande($("#x-nb"));
  mostra(false);
})();
