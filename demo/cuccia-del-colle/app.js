/* La Cuccia del Colle - app dimostrativa sopra il kit Noxford. Nessun dato viene inviato: tutto resta nel browser. */
(function () {
  "use strict";
  var d = document, esc = NX.esc;
  var $ = function (s, r) { return (r || d).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); };
  var euro = function (n) { n = Math.round(n * 100) / 100; return (n % 1 ? n.toFixed(2).replace(".", ",") : n) + " €"; };
  var mem = {
    get: function (k, def) { try { var v = localStorage.getItem("cuccia-" + k); return v ? JSON.parse(v) : def; } catch (e) { return def; } },
    set: function (k, v) { try { localStorage.setItem("cuccia-" + k, JSON.stringify(v)); } catch (e) {} }
  };

  /* ---------- preferenze: ?stile=a|b|c, ?tema=chiaro|scuro, ?vetro=si|no ---------- */
  var q = new URLSearchParams(location.search);
  var stile = /^[abc]$/.test(q.get("stile") || "") ? q.get("stile") : "a";
  var STILI = [["a", "Classico", "Liste raggruppate come nelle Impostazioni di iPhone."], ["b", "Editoriale", "Foto del prato e delle stanze in grande, schede ampie."], ["c", "Compatto", "Riquadri, prezzi e azioni rapide in una schermata."]];
  NX.pref.init();
  if (q.get("tema")) NX.pref.tema(q.get("tema"), { salva: false });
  if (q.get("vetro")) NX.pref.vetro(q.get("vetro") !== "no", { salva: false });
  function scriviUrl(tutto) {
    var p = new URLSearchParams(location.search); p.set("stile", stile);
    if (tutto) { p.set("tema", NX.pref.temaAttivo()); p.set("vetro", NX.pref.vetroAttivo() ? "si" : "no"); }
    try { history.replaceState(null, "", location.pathname + "?" + p.toString() + location.hash); } catch (e) {}
  }
  d.addEventListener("nx:pref", function () { scriviUrl(true); });

  /* ---------- icone ---------- */
  var S = function (p) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + p + "</svg>"; };
  var IC = {
    chev: '<svg class="x-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
    casa: S('<path d="M4 11 12 4l8 7v9H4z"/><path d="M10 20v-5h4v5"/>'),
    sole: S('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19"/>'),
    bosco: S('<path d="M8 3 3 13h10zM8 9 2 19h12zM8 19v3M17 6l-4 8h8zM17 14v8"/>'),
    fischio: S('<circle cx="9" cy="14" r="5"/><path d="M13 11l8-5v5l-6 3"/>'),
    forbici: S('<circle cx="6" cy="7" r="2.5"/><circle cx="6" cy="17" r="2.5"/><path d="M8 8.5 20 16M8 15.5 20 8"/>'),
    zampa: S('<circle cx="12" cy="15" r="4"/><circle cx="6" cy="10" r="1.8"/><circle cx="10" cy="6.5" r="1.8"/><circle cx="14" cy="6.5" r="1.8"/><circle cx="18" cy="10" r="1.8"/>'),
    gatto: S('<path d="M5 20v-8l-1-7 4 3h8l4-3-1 7v8z"/><path d="M9.5 13v.5M14.5 13v.5M11 16.5h2"/>'),
    wa: S('<path d="M4 20l1.3-3.8A8 8 0 1 1 8 19z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8a4 4 0 0 1-1.8-1.8l.8-1-1-2z"/>')
  };

  /* ---------- dati di esempio ---------- */
  var TAGLIE = [["piccola", "Piccola", "fino a 10 kg"], ["media", "Media", "10-25 kg"], ["grande", "Grande", "oltre 25 kg"]];
  var SERV = [
    { id: "pensione", n: "Pensione", d: "Stanza sua, due uscite al giorno sul prato, foto ogni sera.", u: "a notte", p: [24, 28, 33], img: "img/stanza.webp", notti: 1,
      incl: ["Stanza singola riscaldata con cuccia e coperta", "Tre ore al giorno sul prato in piccoli gruppi", "Pasti con il suo cibo, agli orari di casa", "Foto e messaggio ogni sera su WhatsApp", "Veterinario di fiducia a 10 minuti"] },
    { id: "asilo", n: "Asilo di giorno", d: "Dalle 8 alle 19: gioco, riposo e compagnia mentre lavori.", u: "al giorno", p: [18, 20, 23], ic: "sole",
      incl: ["Ingresso dalle 7:30 alle 9:30", "Gruppi divisi per taglia e carattere", "Pisolino in stanza dopo pranzo", "Pacchetto 10 giorni con uno in omaggio"] },
    { id: "toeletta", n: "Toelettatura", d: "Per cani e gatti: bagno, taglio, sottopelo, unghie. Prezzo per taglia e pelo.", u: "a seduta", p: [12, 12, 15], img: "img/toelettatura.webp", vai: "#/toelettatura", da: 1 },
    { id: "bosco", n: "Passeggiata nel bosco", d: "Due ore sui sentieri del colle, massimo quattro cani.", u: "a uscita", p: [15, 15, 18], ic: "bosco",
      incl: ["Ritiro sotto casa entro 10 km", "Guinzaglio lungo e acqua al seguito", "Asciugatura zampe prima del rientro"] },
    { id: "educazione", n: "Educazione di base", d: "Richiamo, guinzaglio e calma in casa, con l'educatrice.", u: "5 lezioni", p: [180, 180, 180], ic: "fischio",
      incl: ["Cinque incontri da 50 minuti", "Esercizi da fare a casa, spiegati semplici", "Una lezione in città, tra le persone"] }
  ];
  var CANI = [["birba", "Birba", "meticcia, 14 kg", "media", "medio"], ["otto", "Otto", "bassotto, 8 kg", "piccola", "corto"]];

  /* toelettatura: listino per animale, taglia e tipo di pelo */
  var TG = {
    cane: {
      taglie: [["piccola", "Piccola", "fino a 10 kg"], ["media", "Media", "10-25 kg"], ["grande", "Grande", "25-40 kg"], ["gigante", "Gigante", "oltre 40 kg"]],
      peli: [["corto", "Corto", 0, 0], ["medio", "Medio", 5, 15], ["lungo", "Lungo", 10, 30], ["riccio", "Riccio", 15, 30], ["sottopelo", "Con sottopelo", 12, 30]],
      serv: [
        { id: "bagno", n: "Bagno e asciugatura", d: "Shampoo adatto al suo pelo, asciugatura e spazzolatura.", p: [25, 32, 40, 50], m: [60, 75, 90, 120] },
        { id: "taglio", n: "Bagno e taglio", d: "Bagno completo più taglio a forbice o macchinetta, come lo vuoi tu.", p: [40, 50, 62, 78], m: [105, 120, 150, 180] },
        { id: "sottopelo", n: "Bagno e rimozione del sottopelo", d: "Per chi perde tanto pelo: via il sottopelo morto, niente rasatura.", p: [35, 45, 55, 70], m: [90, 105, 120, 150] },
        { id: "igiene", n: "Unghie, orecchie e zampe", d: "Taglio delle unghie, pulizia delle orecchie e del pelo tra i polpastrelli.", p: [12, 12, 15, 15], m: [20, 20, 30, 30], fisso: 1 }
      ],
      orari: ["8:30", "9:30", "10:30", "11:30", "14:30", "15:30", "16:30"], giorni: [2, 3, 4, 5, 6], chiude: 18.5
    },
    gatto: {
      taglie: [["piccola", "Fino a 5 kg", ""], ["grande", "Oltre 5 kg", ""]],
      peli: [["corto", "Corto", 0, 0], ["lungo", "Lungo", 10, 20]],
      serv: [
        { id: "bagno", n: "Bagno e asciugatura", d: "Nella saletta senza cani, con asciugatore silenzioso.", p: [35, 42], m: [60, 75] },
        { id: "sottopelo", n: "Spazzolatura e sottopelo", d: "Senza bagno: si toglie il pelo morto e si sciolgono i nodi.", p: [28, 34], m: [45, 60] },
        { id: "tosa", n: "Tosatura igienica", d: "Per pelo lungo con nodi: pancia, zampe posteriori e zona intima.", p: [40, 48], m: [60, 75] },
        { id: "igiene", n: "Unghie e orecchie", d: "Taglio delle unghie e pulizia delle orecchie.", p: [10, 10], m: [15, 15], fisso: 1 }
      ],
      orari: ["8:30", "9:30", "10:30"], giorni: [2, 4], chiude: 12.5
    }
  };

  var st = mem.get("stato2", null) || { taglia: "media", richieste: [], toel: [] };
  if (!Array.isArray(st.toel)) st.toel = [];
  var salva = function () { mem.set("stato2", st); };
  var tg = { animale: "cane", chi: "birba", nome: "Birba", taglia: "media", pelo: "medio", serv: "taglio", g: null, ora: null };
  var byId = function (id) { return SERV.filter(function (s) { return s.id === id; })[0]; };
  var ti = function (t) { return TAGLIE.map(function (x) { return x[0]; }).indexOf(t); };
  var GG = ["dom", "lun", "mar", "mer", "gio", "ven", "sab"], GGL = ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"];
  var MM = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];
  var giorno = function (k) { var x = new Date(); x.setHours(12, 0, 0, 0); x.setDate(x.getDate() + k); return x; };
  var oggiIso = function (k) { var x = giorno(k || 0); return x.getFullYear() + "-" + String(x.getMonth() + 1).padStart(2, "0") + "-" + String(x.getDate()).padStart(2, "0"); };
  var fmt = function (iso) { return new Date(iso + "T12:00").toLocaleDateString("it-IT", { day: "numeric", month: "long" }); };
  var quando = function (k) { var x = giorno(k); return GGL[x.getDay()] + " " + x.getDate() + " " + MM[x.getMonth()]; };
  var icona = function (s) { return s.img ? '<img src="' + s.img + '" alt="" loading="lazy" width="88" height="88">' : IC[s.ic]; };
  var durTesto = function (m) { return m >= 60 ? Math.floor(m / 60) + " h" + (m % 60 ? " " + m % 60 + " min" : "") : m + " min"; };
  var oraNum = function (o) { var p = o.split(":"); return +p[0] + (+p[1]) / 60; };
  var waLink = function (t) { return "https://wa.me/?text=" + encodeURIComponent(t); };

  /* calcolo della toelettatura scelta: prezzo e durata indicativi */
  function tgCalc(an, taglia, pelo, servId) {
    var A = TG[an], i = A.taglie.map(function (x) { return x[0]; }).indexOf(taglia), s = A.serv.filter(function (x) { return x.id === servId; })[0];
    if (i < 0) i = 0; if (!s) s = A.serv[0];
    var pl = A.peli.filter(function (x) { return x[0] === pelo; })[0] || A.peli[0];
    var p = s.p[i] + (s.fisso ? 0 : pl[2]), m = s.m[i] + (s.fisso ? 0 : pl[3]);
    return { s: s, p: p, m: Math.ceil(m / 15) * 15, tagliaN: A.taglie[i][1], peloN: pl[1] };
  }
  var tgOcc = function (k, i) { return ((giorno(k).getDate() * 5 + i * 3 + (tg.animale === "gatto" ? 1 : 0)) % 7) < 3; };
  function tgOrari(k) {
    var A = TG[tg.animale], c = tgCalc(tg.animale, tg.taglia, tg.pelo, tg.serv);
    return A.orari.map(function (o, i) {
      var inizio = oraNum(o), fine = inizio + c.m / 60, pausa = inizio < 13 && fine > 13 && tg.animale === "cane";
      return { o: o, ok: !tgOcc(k, i) && fine <= A.chiude && !pausa && !(k === 0) };
    });
  }
  var tgAperto = function (k) { return TG[tg.animale].giorni.indexOf(giorno(k).getDay()) > -1 && k > 0; };

  /* ---------- pezzi comuni ---------- */
  function cartaNext() {
    var r = st.richieste[0] || st.toel[0];
    return '<a class="x-card k-next" href="#/cane" data-nx-premi><span class="k-dot">B</span><span class="t"><b>' + (r ? esc(r.tit) : "Birba è da noi") + "</b><small>" + (r ? esc(r.sub) + " · richiesta inviata" : "Guarda il diario di oggi e la foto della sera") + '</small></span><i class="nx-chev"></i></a>';
  }
  var passi = '<ol class="x-card k-passi"><li><span><b>Visita di conoscenza</b><span>Gratis, mezz\'ora con il tuo cane in giardino.</span></span></li><li><span><b>Libretto in regola</b><span>Vaccini e trattamento antiparassitario aggiornati.</span></span></li><li><span><b>Le sue abitudini</b><span>Cibo, orari, paure: le segniamo nella sua scheda.</span></span></li></ol>';
  var linkServ = function (s) { return s.vai || "#/servizio/" + s.id; };
  function cellaServ(s, i) {
    return '<li><a class="nx-cella ic" href="' + linkServ(s) + '"><span class="nx-c-ic k-ic">' + icona(s) + '</span><span class="nx-c-tx"><b>' + esc(s.n) + "</b><small>" + (s.da ? "da " : "") + euro(s.p[i]) + " " + s.u + '</small></span><i class="nx-chev"></i></a></li>';
  }

  /* ---------- viste ---------- */
  var titolo = "";
  function vHome() {
    titolo = "La Cuccia del Colle";
    var nuovo = '<a class="k-nuovo" href="#/toelettatura" data-nx-premi><span class="k-ic">' + IC.forbici + "</span><span><b>Toelettatura per cani e gatti</b><small>Listino per taglia e pelo, scegli giorno e ora</small></span></a>";
    if (stile === "b") {
      return '<div class="x-foto k-hero-b"><img src="img/prato.webp" width="1000" height="747" alt="Un cane dal pelo biondo che corre felice sul prato recintato, con ulivi e un fienile sullo sfondo" fetchpriority="high"><div class="x-foto-tx"><h1>Tu parti tranquillo, lui corre sul prato.</h1><p>4.000 m² di prato recintato, asilo di giorno e toelettatura. Ogni sera foto e due righe su com\'è andata.</p><a class="nx-btn" href="#/prenota">Prenota la pensione</a></div></div>' +
        '<h2 class="x-sez">Birba oggi</h2>' + cartaNext() +
        '<h2 class="x-sez">Cosa facciamo</h2><div class="k-ed">' + SERV.slice(0, 3).map(function (s) {
          return '<a class="x-card k-ed-c" href="' + linkServ(s) + '" data-nx-premi>' + (s.img ? '<div class="x-foto"><img src="' + s.img + '" alt="" loading="lazy" width="800" height="450"></div>' : '<div class="k-ed-p"><span>' + s.u + "</span>" + IC[s.ic] + "</div>") +
            '<div class="k-ed-t"><h3>' + esc(s.n) + "</h3><p>" + esc(s.d) + '</p><div class="k-ed-m">' + (s.da ? "da " : "") + euro(s.p[0]) + " " + s.u + "</div></div></a>";
        }).join("") + "</div>" +
        '<h2 class="x-sez">Prima del primo soggiorno</h2>' + passi;
    }
    if (stile === "c") {
      var n = st.richieste.length + st.toel.length;
      return '<div class="k-kpi"><a class="x-card" href="#/cane"><small>Birba</small><b>In pensione</b><small>fino al 18 novembre</small></a><a class="x-card" href="#/' + (st.toel.length ? "toelettatura" : "prenota") + '"><small>Richieste</small><b>' + n + (n === 1 ? " inviata" : " inviate") + "</b><small>" + (n ? "in attesa di risposta" : "nessuna per ora") + "</small></a></div>" +
        '<h2 class="x-sez">Azioni rapide</h2><div class="k-azioni">' +
        '<a class="x-card" href="#/prenota/pensione" data-nx-premi><span class="k-ic">' + IC.casa + '</span>Pensione</a><a class="x-card" href="#/toelettatura" data-nx-premi><span class="k-ic">' + IC.forbici + '</span>Toelettatura</a>' +
        '<a class="x-card" href="#/prenota/asilo" data-nx-premi><span class="k-ic">' + IC.sole + '</span>Asilo di giorno</a><a class="x-card" href="#/cane" data-nx-premi><span class="k-ic">' + IC.zampa + "</span>Diario di Birba</a></div>" +
        '<h2 class="x-sez">Prezzi per taglia</h2><div class="x-card k-tab-w"><table class="k-tab"><thead><tr><th scope="col">Servizio</th>' + TAGLIE.map(function (t) { return '<th scope="col">' + t[1] + "</th>"; }).join("") + "</tr></thead><tbody>" +
        SERV.filter(function (s) { return !s.da; }).map(function (s) { return '<tr><th scope="row" style="font-weight:600">' + esc(s.n) + "</th>" + s.p.map(function (p) { return "<td>" + euro(p) + "</td>"; }).join("") + "</tr>"; }).join("") + "</tbody></table></div>" +
        '<p class="x-nota">Prezzi per cane. La toelettatura ha un <a href="#/toelettatura">listino a parte</a>, per taglia e pelo.</p>';
    }
    return '<div class="x-foto k-hero-a"><img src="img/prato.webp" width="1000" height="747" alt="Un cane dal pelo biondo che corre felice sul prato recintato, con ulivi e un fienile sullo sfondo" fetchpriority="high"><div class="x-foto-tx"><h2>Tu parti tranquillo, lui corre sul prato.</h2><p>Ogni sera ti mandiamo foto e due righe su com\'è andata.</p></div></div>' +
      cartaNext() + nuovo +
      '<h2 class="x-sez">Cosa facciamo</h2><ul class="nx-lista">' + SERV.map(function (s) { return cellaServ(s, 0); }).join("") + "</ul>" +
      '<h2 class="x-sez">Prima del primo soggiorno</h2>' + passi;
  }
  function vServizi() {
    titolo = "Servizi e prezzi";
    var i = ti(st.taglia);
    var seg = '<div class="nx-seg pieno k-taglie" id="k-taglia" role="group" aria-label="Taglia del cane">' + TAGLIE.map(function (t) { return '<button type="button" data-v="' + t[0] + '" aria-pressed="' + (t[0] === st.taglia) + '">' + t[1] + "</button>"; }).join("") + '</div><p class="x-nota" style="margin:-6px 2px 14px">Prezzi per un cane di taglia ' + TAGLIE[i][1].toLowerCase() + " (" + TAGLIE[i][2] + ").</p>";
    if (stile === "b") return seg + '<div class="k-ed">' + SERV.map(function (s) {
      return '<a class="x-card k-ed-c" href="' + linkServ(s) + '" data-nx-premi>' + (s.img ? '<div class="x-foto"><img src="' + s.img + '" alt="" loading="lazy" width="800" height="450"></div>' : '<div class="k-ed-p"><span>' + s.u + "</span>" + IC[s.ic] + "</div>") +
        '<div class="k-ed-t"><h3>' + esc(s.n) + "</h3><p>" + esc(s.d) + '</p><div class="k-ed-m">' + (s.da ? "da " : "") + euro(s.p[i]) + " " + s.u + "</div></div></a>";
    }).join("") + "</div>";
    if (stile === "c") return seg + '<div class="k-azioni">' + SERV.map(function (s) { return '<a class="x-card" href="' + linkServ(s) + '" data-nx-premi style="flex-direction:column;align-items:flex-start"><span class="k-ic">' + icona(s) + "</span><span>" + esc(s.n) + '<br><span style="font-weight:400;color:var(--nx-tx2)">' + (s.da ? "da " : "") + euro(s.p[i]) + " " + s.u + "</span></span></a>"; }).join("") + "</div>";
    return seg + '<ul class="nx-lista">' + SERV.map(function (s) { return cellaServ(s, i); }).join("") + "</ul>";
  }
  function vServizio(id) {
    var s = byId(id);
    if (s && s.vai) { location.replace(s.vai); return ""; }
    if (!s) { titolo = "Servizio"; return NX.stato.errore("Servizio non trovato", "Il collegamento non è più valido.", ["Vedi i servizi", "servizi"]); }
    titolo = s.n;
    return (s.img ? '<div class="x-foto k-det-img"><img src="' + s.img + '" alt="" width="800" height="500"></div>' : '<div class="k-det-ill">' + IC[s.ic] + "</div>") +
      '<p class="k-desc">' + esc(s.d) + '</p><div class="k-listino">' + TAGLIE.map(function (t, i) { return '<div class="x-card"><small>' + t[1] + "</small><b>" + euro(s.p[i]) + "</b><small>" + s.u + "</small></div>"; }).join("") + "</div>" +
      '<h2 class="x-sez">Cosa comprende</h2><ul class="x-card k-incl">' + s.incl.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>" +
      '<a class="nx-btn p pieno x-cta" href="#/prenota/' + s.id + '">Prenota ' + s.n.toLowerCase() + "</a>";
  }

  /* --- pensione, asilo, passeggiate, educazione --- */
  var prenServ = SERV.filter(function (s) { return !s.da; });
  function vPrenota(id) {
    titolo = "Prenota";
    var sid = id && byId(id) && !byId(id).da ? id : (vPrenota.ultimo || "pensione");
    vPrenota.ultimo = sid;
    return '<form id="k-form" novalidate><label class="nx-campo"><span>Servizio</span><select id="k-serv">' + prenServ.map(function (s) { return '<option value="' + s.id + '"' + (s.id === sid ? " selected" : "") + ">" + esc(s.n) + "</option>"; }).join("") + "</select><small>Per la toelettatura c'è la <a href=\"#/toelettatura\">sua sezione</a>, con listino e orari.</small></label>" +
      '<div class="k-due" id="k-date"><label class="nx-campo"><span id="k-l-dal">Arrivo</span><input type="date" id="k-dal" value="' + oggiIso(3) + '" min="' + oggiIso(1) + '"></label><label class="nx-campo" id="k-w-al"><span>Partenza</span><input type="date" id="k-al" value="' + oggiIso(7) + '" min="' + oggiIso(2) + '"></label></div>' +
      '<p class="x-err" id="k-err" role="alert"></p>' +
      '<p class="x-lab">Per chi</p><ul class="nx-lista k-scelte">' + CANI.map(function (c, i) { return '<li><label class="nx-cella"><input type="checkbox" name="cane" value="' + c[0] + '" data-t="' + c[3] + '" data-n="' + c[1] + '"' + (i ? "" : " checked") + '><span class="nx-c-tx"><b>' + c[1] + "</b><small>" + c[2] + "</small></span></label></li>"; }).join("") + "</ul>" +
      '<p class="x-lab">Extra</p><ul class="nx-lista k-scelte">' +
      [["bagno", 25, 0, "Bagno prima del ritorno a casa", "25 € a cane"], ["ritiro", 20, 0, "Ritiro e riconsegna a casa (entro 15 km)", "20 € a cane"], ["passeggiata", 8, 1, "Passeggiata lunga nel bosco, ogni giorno", "8 € al giorno"]].map(function (x) {
        return '<li><label class="nx-cella"><input type="checkbox" name="ex" value="' + x[0] + '" data-p="' + x[1] + '"' + (x[2] ? ' data-notte="1"' : "") + ' data-n="' + x[3] + '"><span class="nx-c-tx"><b style="white-space:normal">' + x[3] + "</b></span><em>" + x[4] + "</em></label></li>";
      }).join("") + "</ul>" +
      '<label class="nx-campo" style="margin-top:18px"><span>Note per noi</span><textarea id="k-note" rows="3" maxlength="300" placeholder="Es. ha paura dei temporali, mangia alle 7 e alle 18"></textarea></label>' +
      '<div class="k-conto" id="k-conto" aria-live="polite"></div>' +
      '<button class="nx-btn p pieno x-cta" type="submit">Invia la richiesta</button>' +
      '<p class="x-nota">Demo: la richiesta resta in questo browser e puoi mandarla su WhatsApp con il testo già scritto. Nella versione vera arriva al telefono della pensione e ti rispondiamo entro un\'ora.</p></form>' +
      '<div id="k-ok" hidden></div>';
  }
  function calcola() {
    var s = byId($("#k-serv").value), dal = $("#k-dal").value, al = $("#k-al").value, err = "", giorni = 1;
    if (s.notti) {
      giorni = Math.round((new Date(al) - new Date(dal)) / 864e5);
      if (!dal || !al) err = "Scegli le date di arrivo e di partenza.";
      else if (giorni < 1) err = "La partenza deve essere dopo l'arrivo.";
      else if (giorni > 30) err = "Per soggiorni oltre 30 notti chiamaci: facciamo un prezzo a parte.";
    } else if (!dal) err = "Scegli il giorno.";
    if (!err && dal < oggiIso(1)) err = "Scegli un giorno da domani in poi.";
    var cani = $$("input[name=cane]:checked");
    if (!err && !cani.length) err = "Scegli almeno un cane.";
    var righe = [], tot = 0;
    if (!err) {
      cani.forEach(function (c, k) {
        var p = s.p[ti(c.dataset.t)] * (s.notti ? giorni : 1), sc = k ? .15 : 0;
        righe.push([c.dataset.n + " · " + (s.notti ? giorni + (giorni === 1 ? " notte" : " notti") : s.u) + (sc ? " (−15% secondo cane)" : ""), p * (1 - sc)]); tot += p * (1 - sc);
      });
      $$("input[name=ex]:checked").forEach(function (e) { var p = +e.dataset.p * (e.dataset.notte ? Math.max(1, giorni) : 1) * cani.length; righe.push([e.dataset.n, p]); tot += p; });
    }
    return { s: s, err: err, righe: righe, tot: tot, giorni: giorni, cani: cani.map(function (c) { return c.dataset.n; }) };
  }
  function conto() {
    if (!$("#k-serv")) return;
    var s = byId($("#k-serv").value);
    $("#k-w-al").hidden = !s.notti; $("#k-l-dal").textContent = s.notti ? "Arrivo" : "Giorno";
    $("#k-date").classList.toggle("uno", !s.notti);
    var c = calcola();
    $("#k-err").textContent = c.err;
    $("#k-conto").innerHTML = c.err ? "<p><span>Completa i dati per vedere il prezzo.</span></p>" : c.righe.map(function (r) { return "<p><span>" + esc(r[0]) + "</span><span>" + euro(r[1]) + "</span></p>"; }).join("") + '<p class="g"><span>Totale indicativo</span><span>' + euro(c.tot) + "</span></p>";
  }
  function inviaPensione() {
    var c = calcola();
    if (c.err) { $("#k-err").textContent = c.err; NX.toast(c.err, "no"); return; }
    var dal = $("#k-dal").value, al = $("#k-al").value, note = $("#k-note").value.trim();
    var periodo = c.s.notti ? "dal " + fmt(dal) + " al " + fmt(al) : "il " + fmt(dal);
    var extra = $$("input[name=ex]:checked").map(function (e) { return e.dataset.n; });
    st.richieste.unshift({ tit: c.s.n + " per " + c.cani.join(" e "), sub: periodo, tot: c.tot }); salva();
    var testo = "Ciao, vorrei prenotare: " + c.s.n + " per " + c.cani.join(" e ") + ", " + periodo + "." + (extra.length ? "\nExtra: " + extra.join(", ") + "." : "") + "\nTotale indicativo: " + euro(c.tot) + "." + (note ? "\nNote: " + note : "") + "\nGrazie!";
    $("#k-form").hidden = true;
    var ok = $("#k-ok"); ok.hidden = false;
    NX.vista(ok, '<div class="x-card k-ok"><span class="nx-imp-ok">' + NX.icona("ok") + '</span><h2>Richiesta pronta</h2><p><b>' + esc(c.s.n) + "</b> per " + esc(c.cani.join(" e ")) + ", " + periodo + '.</p><p>Totale indicativo: <b>' + euro(c.tot) + '</b></p><a class="nx-btn p pieno" href="' + waLink(testo) + '" target="_blank" rel="noopener" id="k-wa-p">' + IC.wa + 'Manda su WhatsApp</a><a class="nx-btn pieno" href="#/cane">Vai alla scheda di Birba</a><p class="x-nota">Nella versione vera il messaggio arriva al numero della pensione.</p></div>');
    window.scrollTo(0, 0);
  }

  /* --- toelettatura --- */
  function vToelettatura(chi) {
    titolo = "Toelettatura";
    if (chi === "birba" || chi === "otto") scegliChi(chi);
    if (tg.g === null || !tgAperto(tg.g)) tg.g = primoGiornoTg();
    var testa = stile === "c" ? "" : '<div class="x-foto k-tg-head"><img src="img/toelettatura.webp" width="1000" height="747" alt="Un cane appena lavato sul tavolo della toelettatura, con spazzole e asciugamani" loading="lazy"><div class="x-foto-tx"><h2>Pulito, asciutto, senza fretta.</h2><p>Cani dal martedì al sabato. Gatti martedì e giovedì mattina, nella saletta senza cani.</p></div></div>';
    return testa + '<div id="tg-form">' + tgForm() + "</div>" + '<div id="tg-ric">' + tgRichieste() + "</div>";
  }
  function primoGiornoTg() { for (var k = 1; k < 21; k++) if (tgAperto(k) && tgOrari(k).some(function (x) { return x.ok; })) return k; return 1; }
  function scegliChi(chi) {
    tg.chi = chi;
    var c = CANI.filter(function (x) { return x[0] === chi; })[0];
    if (c) { tg.animale = "cane"; tg.nome = c[1]; tg.taglia = c[3]; tg.pelo = c[4]; }
    else if (chi === "altro") { tg.animale = "cane"; tg.nome = ""; }
    else if (chi === "gatto") { tg.animale = "gatto"; tg.nome = ""; }
    var A = TG[tg.animale];
    if (!A.taglie.some(function (x) { return x[0] === tg.taglia; })) tg.taglia = A.taglie[0][0];
    if (!A.peli.some(function (x) { return x[0] === tg.pelo; })) tg.pelo = A.peli[0][0];
    if (!A.serv.some(function (x) { return x.id === tg.serv; })) tg.serv = A.serv[0].id;
    tg.ora = null;
  }
  function tgForm() {
    var A = TG[tg.animale], gatto = tg.animale === "gatto";
    var chi = [["birba", "Birba"], ["otto", "Otto"], ["altro", "Un altro cane"], ["gatto", "Un gatto"]];
    var h = '<h2 class="k-pass"><i>1</i>Chi viene</h2><div class="nx-chips k-chips" role="group" aria-label="Animale">' + chi.map(function (c) { return '<button type="button" class="nx-chip" data-chi="' + c[0] + '" aria-pressed="' + (tg.chi === c[0]) + '">' + c[1] + "</button>"; }).join("") + "</div>";
    if (tg.chi === "altro" || tg.chi === "gatto") h += '<label class="nx-campo" style="margin-top:12px"><span>Come si chiama</span><input id="tg-nome" maxlength="30" autocomplete="off" value="' + esc(tg.nome) + '" placeholder="' + (gatto ? "Es. Micia" : "Es. Fido") + '"></label>';
    h += '<p class="k-sub">' + (gatto ? "Peso" : "Taglia") + '</p><div class="nx-seg pieno k-taglia-seg" id="tg-taglia" role="group" aria-label="Taglia">' + A.taglie.map(function (t) { return '<button type="button" data-v="' + t[0] + '" aria-pressed="' + (t[0] === tg.taglia) + '"' + (t[2] ? ' title="' + t[2] + '"' : "") + ">" + t[1] + "</button>"; }).join("") + "</div>" +
      (gatto ? "" : '<p class="x-nota" style="margin-top:6px">' + A.taglie.map(function (t) { return t[1] + " " + t[2]; }).join(" · ") + "</p>") +
      '<p class="k-sub">Tipo di pelo</p><div class="nx-chips k-chips" role="group" aria-label="Tipo di pelo">' + A.peli.map(function (p) { return '<button type="button" class="nx-chip" data-pelo="' + p[0] + '" aria-pressed="' + (p[0] === tg.pelo) + '">' + p[1] + "</button>"; }).join("") + "</div>" +
      '<h2 class="k-pass"><i>2</i>Cosa facciamo</h2><ul class="nx-lista k-serv" role="radiogroup" aria-label="Servizio">' + A.serv.map(function (s) {
        var c = tgCalc(tg.animale, tg.taglia, tg.pelo, s.id);
        return '<li><label class="nx-cella"><input type="radio" name="tg-serv" value="' + s.id + '"' + (s.id === tg.serv ? " checked" : "") + '><span class="nx-c-tx"><b>' + esc(s.n) + "</b><small>" + esc(s.d) + '</small></span><span class="k-pr"><b>' + euro(c.p) + "</b><small>circa " + durTesto(c.m) + "</small></span></label></li>";
      }).join("") + '</ul><button type="button" class="nx-btn t" id="tg-listino" style="margin-top:6px">Vedi il listino completo</button>' +
      '<h2 class="k-pass"><i>3</i>Quando</h2><div class="x-giorni" id="tg-giorni" role="group" aria-label="Giorno">' + tgGiorni() + '</div><p class="k-sub">Orario di inizio</p><div class="x-orari" id="tg-orari" role="group" aria-label="Orario" aria-live="polite">' + tgOrariHtml() + "</div>" +
      '<label class="nx-campo" style="margin-top:18px"><span>Note per chi lo lava (facoltativo)</span><textarea id="tg-note" rows="2" maxlength="200" placeholder="' + (gatto ? "Es. non ama l\'asciugatore" : "Es. taglio corto d\'estate, ha paura del phon") + '"></textarea></label>' +
      '<div class="x-riep" id="tg-riep" aria-live="polite">' + tgRiep() + "</div>" +
      '<a class="nx-btn p pieno x-cta k-wa" id="tg-wa" href="#" target="_blank" rel="noopener" aria-disabled="true">' + IC.wa + "Chiedi su WhatsApp</a>" +
      '<p class="x-err" id="tg-err" role="alert"></p>' +
      '<p class="x-nota">Prezzi e durate sono indicativi: con nodi o pelo infeltrito si decide insieme prima di iniziare. Il tasto apre WhatsApp con la richiesta già scritta; nella versione vera arriva al numero della pensione, che conferma l\'orario.</p>';
    return h;
  }
  function tgGiorni() {
    var h = "";
    for (var k = 1; k < 15; k++) { var x = giorno(k), ap = tgAperto(k); h += '<button type="button" data-tgg="' + k + '" aria-pressed="' + (k === tg.g) + '"' + (ap ? "" : " disabled") + ' aria-label="' + GGL[x.getDay()] + " " + x.getDate() + (ap ? "" : ", chiuso per " + (tg.animale === "gatto" ? "i gatti" : "la toelettatura")) + '"><small>' + (k === 1 ? "domani" : GG[x.getDay()]) + "</small><b>" + x.getDate() + "</b></button>"; }
    return h;
  }
  function tgOrariHtml() {
    var l = tgOrari(tg.g);
    if (!l.some(function (x) { return x.ok; })) { tg.ora = null; return '<div style="grid-column:1/-1">' + NX.stato.vuoto("Nessun orario libero", "Con questa durata il giorno è pieno. Prova il prossimo giorno libero.", ["Prossimo giorno", "tg-dopo"]) + "</div>"; }
    return l.map(function (x) { if (!x.ok && tg.ora === x.o) tg.ora = null; return '<button type="button" data-tgo="' + x.o + '" aria-pressed="' + (tg.ora === x.o) + '"' + (x.ok ? "" : ' disabled aria-label="' + x.o + ', non disponibile"') + ">" + x.o + "</button>"; }).join("");
  }
  function tgTesto() {
    var c = tgCalc(tg.animale, tg.taglia, tg.pelo, tg.serv), nome = tg.nome || (tg.animale === "gatto" ? "il mio gatto" : "il mio cane"), note = ($("#tg-note") && $("#tg-note").value.trim()) || "";
    return "Ciao, vorrei prenotare una toelettatura.\n" +
      "Animale: " + (tg.animale === "gatto" ? "gatto" : "cane") + ", " + nome + " (" + (tg.animale === "gatto" ? c.tagliaN.toLowerCase() : "taglia " + c.tagliaN.toLowerCase()) + ", pelo " + c.peloN.toLowerCase() + ")\n" +
      "Servizio: " + c.s.n + "\n" +
      "Quando: " + quando(tg.g) + " alle " + tg.ora + "\n" +
      "Durata indicativa: circa " + durTesto(c.m) + "\n" +
      "Prezzo indicativo: " + euro(c.p) + (note ? "\nNote: " + note : "") + "\nGrazie!";
  }
  function tgRiep() {
    var c = tgCalc(tg.animale, tg.taglia, tg.pelo, tg.serv);
    return '<p class="g">' + esc(c.s.n) + " · " + euro(c.p) + "</p><p>" + esc(tg.nome || (tg.animale === "gatto" ? "Il tuo gatto" : "Il tuo cane")) + ", " + (tg.animale === "gatto" ? c.tagliaN.toLowerCase() : "taglia " + c.tagliaN.toLowerCase()) + ", pelo " + c.peloN.toLowerCase() + "</p><p>" + (tg.ora ? quando(tg.g) + " alle " + tg.ora + " · circa " + durTesto(c.m) : "Scegli un orario per completare la richiesta.") + "</p>";
  }
  function tgAggiorna(parti) {
    if (parti.indexOf("form") > -1) { var y = window.scrollY; NX.vista($("#tg-form"), tgForm()); window.scrollTo(0, y); }
    else {
      if (parti.indexOf("giorni") > -1) $("#tg-giorni").innerHTML = tgGiorni();
      if (parti.indexOf("orari") > -1) $("#tg-orari").innerHTML = tgOrariHtml();
      $("#tg-riep").innerHTML = tgRiep();
    }
    var a = $("#tg-wa"), pronto = !!tg.ora;
    a.setAttribute("aria-disabled", pronto ? "false" : "true");
    a.href = pronto ? waLink(tgTesto()) : "#";
  }
  function tgRichieste() {
    if (!st.toel.length) return "";
    return '<h2 class="x-sez">Le tue richieste</h2><ul class="nx-lista k-ric">' + st.toel.map(function (r, i) {
      return '<li><div class="nx-cella ic"><span class="nx-c-ic k-ic">' + (r.gatto ? IC.gatto : IC.forbici) + '</span><span class="nx-c-tx"><b>' + esc(r.tit) + "</b><small>" + esc(r.sub) + '</small></span><button type="button" class="nx-btn t r" data-tgdel="' + i + '">Togli</button></div></li>';
    }).join("") + '</ul><p class="x-nota">Le richieste restano solo in questo browser, finché la pensione non conferma.</p>';
  }
  function listino() {
    var A = TG[tg.animale], s = A.serv.filter(function (x) { return x.id === tg.serv; })[0];
    var tab = function (sv) {
      return '<p class="k-sub" style="margin-top:18px">' + esc(sv.n) + '</p><div class="k-tab-w"><table class="k-tab"><thead><tr><th scope="col">' + (tg.animale === "gatto" ? "Peso" : "Taglia") + "</th>" + (sv.fisso ? "<th scope=\"col\">Prezzo</th>" : A.peli.map(function (p) { return '<th scope="col">' + p[1] + "</th>"; }).join("")) + "</tr></thead><tbody>" +
        A.taglie.map(function (t) {
          return '<tr><th scope="row">' + t[1] + "</th>" + (sv.fisso ? "<td>" + euro(tgCalc(tg.animale, t[0], "corto", sv.id).p) + "</td>" : A.peli.map(function (p) { var c = tgCalc(tg.animale, t[0], p[0], sv.id), on = t[0] === tg.taglia && p[0] === tg.pelo && sv.id === s.id; return "<td" + (on ? ' class="on"' : "") + ">" + euro(c.p) + "</td>"; }).join("")) + "</tr>";
        }).join("") + "</tbody></table></div>";
    };
    NX.foglio.apri({
      titolo: "Listino toelettatura " + (tg.animale === "gatto" ? "gatti" : "cani"),
      html: '<p style="margin:0;color:var(--nx-tx2)">Prezzi indicativi per taglia e tipo di pelo. Evidenziata la tua scelta.</p>' + A.serv.map(tab).join("") +
        '<p class="x-nota">Pelo molto infeltrito o animale agitato: si valuta insieme prima di iniziare, senza sorprese sul conto.</p>'
    });
  }

  /* --- il mio cane --- */
  function vCane() {
    titolo = "Birba";
    var ult = st.toel.filter(function (r) { return r.nome === "Birba"; })[0];
    return '<div class="x-foto k-cane-img"><img src="img/stanza.webp" width="1200" height="896" alt="Un cane marrone che dorme nella sua cuccia rotonda, in una stanza con pareti di legno e una finestra sul giardino" loading="lazy"><span class="k-live">Stanza 4 · foto delle 21:40</span></div>' +
      '<p class="x-nota" style="margin:0 2px 4px">Meticcia, 6 anni, 14 kg. In pensione dal 14 al 18 novembre.</p>' +
      '<h2 class="x-sez">Il diario di oggi</h2><ol class="x-card k-diario">' +
      [["7:30", "Colazione finita tutta, con le sue crocchette."], ["10:00", "Un'ora sul prato con Otto e Luna. Ha riportato la palla 23 volte."], ["13:00", "Pisolino all'ombra degli ulivi."], ["17:30", "Passeggiata nel bosco, 3 km."], ["21:40", "Dorme nella sua stanza, con la coperta che ci hai lasciato."]].map(function (x) { return "<li><b>" + x[0] + "</b><span>" + x[1] + "</span></li>"; }).join("") + "</ol>" +
      '<h2 class="x-sez">Toelettatura</h2><ul class="nx-lista"><li><div class="nx-cella ic"><span class="nx-c-ic k-ic">' + IC.forbici + '</span><span class="nx-c-tx"><b>' + (ult ? "Richiesta: " + esc(ult.serv) : "Ultima: bagno e taglio") + "</b><small>" + (ult ? esc(ult.sub) : "3 settembre · pelo medio, taglia media") + '</small></span></div></li><li><a class="nx-cella" href="#/toelettatura/birba"><span class="nx-c-tx"><b style="color:var(--nx-tinta-tx)">Prenota la toelettatura per Birba</b></span><i class="nx-chev"></i></a></li></ul>' +
      '<h2 class="x-sez">La sua scheda</h2><ul class="nx-lista k-scheda">' +
      [["Vaccini", "In regola fino a marzo 2027"], ["Cibo", "Crocchette sue, 2 pasti (7:00 e 18:00)"], ["Carattere", "Socievole con i cani, timida con le persone nuove"], ["Da sapere", "Ha paura dei tuoni: tenerla dentro se piove"]].map(function (x) { return '<li><div class="nx-cella"><span class="nx-c-tx"><small>' + x[0] + "</small><b style=\"white-space:normal\">" + x[1] + "</b></span></div></li>"; }).join("") + "</ul>" +
      '<p class="x-nota">Cane, diario e foto sono di esempio.</p>';
  }

  /* ---------- router ---------- */
  var V = {
    home: { tab: "home", r: vHome, noTit: function () { return stile === "b"; } },
    servizi: { tab: "servizi", r: vServizi, dopo: function () { NX.seg($("#k-taglia"), function (v) { st.taglia = v; salva(); mostra(false); }); } },
    servizio: { tab: "servizi", r: vServizio, back: ["#/servizi", "Servizi"] },
    toelettatura: { tab: "toelettatura", r: vToelettatura, dopo: function () { tgDopo(); } },
    prenota: { tab: "prenota", r: vPrenota, dopo: function () { conto(); } },
    cane: { tab: "cane", r: vCane }
  };
  function tgDopo() {
    var s = $("#tg-taglia"); if (s) NX.seg(s, function (v) { tg.taglia = v; tgAggiorna(["form"]); tgDopo(); });
    tgAggiorna([]);
  }
  var ORD = ["home", "servizi", "servizio", "toelettatura", "prenota", "cane"], corrente = null;
  var box = $("#x-vista");
  function mostra(anim) {
    var p = location.hash.replace(/^#\/?/, "").split("/"), n = V[p[0]] ? p[0] : "home", v = V[n];
    var html = v.r(p[1] ? decodeURIComponent(p[1]) : "");
    if (html === "" && n === "servizio") return;
    var verso = corrente && ORD.indexOf(n) < ORD.indexOf(corrente) ? "sx" : "dx";
    if (anim) NX.vista(box, html, verso); else box.innerHTML = html;
    $("#x-tit").textContent = titolo; $("#x-pic").textContent = n === "home" ? "La Cuccia del Colle" : titolo;
    $("#x-nb-sx").innerHTML = v.back ? '<a class="nx-btn t x-back" href="' + v.back[0] + '">' + IC.chev + v.back[1] + "</a>" : "";
    d.body.classList.toggle("x-no-tit", !!(v.noTit && v.noTit()));
    $$("#x-tab a").forEach(function (a) { if (a.getAttribute("data-tab") === v.tab) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
    d.title = (n === "home" ? "La Cuccia del Colle · Pensione e toelettatura" : titolo + " · La Cuccia del Colle") + " (app dimostrativa)";
    if (v.dopo) v.dopo(p[1]);
    corrente = n;
  }
  function applicaStile() { d.body.setAttribute("data-stile", stile); }
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

  /* ---------- eventi ---------- */
  d.addEventListener("click", function (e) {
    var t = e.target;
    if (t.closest("[data-opzioni]")) { opzioni(); return; }
    var az = t.closest("[data-nx-azione]");
    if (az && box.contains(az)) {
      var k = az.getAttribute("data-nx-azione");
      if (k === "tg-dopo") { var g = tg.g + 1; while (!tgAperto(g) && g < 30) g++; tg.g = g; tg.ora = null; tgAggiorna(["giorni", "orari"]); }
      else location.hash = "#/" + k;
      return;
    }
    var wa = t.closest("#tg-wa");
    if (wa) {
      if (wa.getAttribute("aria-disabled") === "true") { e.preventDefault(); $("#tg-err").textContent = "Scegli giorno e orario prima di mandare la richiesta."; return; }
      if ((tg.chi === "altro" || tg.chi === "gatto") && !tg.nome.trim()) { e.preventDefault(); $("#tg-err").textContent = "Scrivi il nome del tuo " + (tg.animale === "gatto" ? "gatto" : "cane") + "."; $("#tg-nome").focus(); return; }
      wa.href = waLink(tgTesto());
      var c = tgCalc(tg.animale, tg.taglia, tg.pelo, tg.serv);
      st.toel.unshift({ tit: c.s.n + " per " + tg.nome, sub: quando(tg.g) + " alle " + tg.ora + " · " + euro(c.p), serv: c.s.n.toLowerCase(), nome: tg.nome, gatto: tg.animale === "gatto" }); salva();
      $("#tg-err").textContent = ""; $("#tg-ric").innerHTML = tgRichieste();
      NX.toast("WhatsApp aperto con la richiesta pronta.");
      return;
    }
    var b = t.closest("button"); if (!b || !box.contains(b)) return;
    if (b.dataset.chi) { scegliChi(b.dataset.chi); if (!tgAperto(tg.g)) tg.g = primoGiornoTg(); tgAggiorna(["form"]); tgDopo(); }
    else if (b.dataset.pelo) { tg.pelo = b.dataset.pelo; tgAggiorna(["form"]); tgDopo(); }
    else if (b.dataset.tgg) { tg.g = +b.dataset.tgg; tg.ora = null; tgAggiorna(["giorni", "orari"]); }
    else if (b.dataset.tgo) { tg.ora = b.dataset.tgo; $("#tg-err").textContent = ""; tgAggiorna(["orari"]); }
    else if (b.dataset.tgdel) { st.toel.splice(+b.dataset.tgdel, 1); salva(); $("#tg-ric").innerHTML = tgRichieste(); NX.toast("Richiesta tolta."); }
    else if (b.id === "tg-listino") listino();
  });
  d.addEventListener("change", function (e) {
    var t = e.target;
    if (t.name === "tg-serv") { tg.serv = t.value; tg.ora = null; tgAggiorna(["orari"]); }
    else if (t.closest && t.closest("#k-form")) { if (t.id === "k-serv") vPrenota.ultimo = t.value; conto(); }
  });
  d.addEventListener("input", function (e) {
    var t = e.target;
    if (t.id === "tg-nome") { tg.nome = t.value; $("#tg-err").textContent = ""; tgAggiorna([]); }
    else if (t.id === "tg-note") tgAggiorna([]);
    else if (t.closest && t.closest("#k-form")) conto();
  });
  d.addEventListener("submit", function (e) { if (e.target.id === "k-form") { e.preventDefault(); inviaPensione(); } });
  window.addEventListener("hashchange", function () { NX.foglio.chiudi(); mostra(true); window.scrollTo(0, 0); });

  applicaStile();
  NX.titoloGrande($("#x-nb"));
  mostra(false);
})();
