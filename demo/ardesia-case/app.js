/* ---------------------------------------------------------------------
   Base comune delle app dimostrative Noxford (costruita sul kit in
   ../../assets/kit). Stile a|b|c, tema e vetro da indirizzo o dalle
   Opzioni, viste con hash #/vista/parametro, barra alta, schede.
   Nessun dato esce dal browser.
   --------------------------------------------------------------------- */
var X = (function () {
  'use strict';
  var d = document, root = d.documentElement, q = new URLSearchParams(location.search);
  var IC = {
    casa: '<path d="M4 11.5 12 4.5l8 7V20H4z"/><path d="M10 20v-5h4v5"/>',
    cerca: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4 4"/>',
    cuore: '<path d="M12 20s-7.5-4.6-7.5-10.2A4.2 4.2 0 0 1 12 7.2a4.2 4.2 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20z"/>',
    cal: '<rect x="4" y="5.5" width="16" height="14.5" rx="3"/><path d="M4 10h16M9 3.5v4M15 3.5v4"/>',
    opz: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2.2"/><circle cx="9" cy="17" r="2.2"/>',
    sx: '<path d="M15 5l-7 7 7 7"/>',
    dx: '<path d="M9 5l7 7-7 7"/>',
    piu: '<path d="M12 5v14M5 12h14"/>',
    meno: '<path d="M5 12h14"/>',
    ok: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    tel: '<path d="M5 4h3.5l1.5 4-2 1.5a11 11 0 0 0 5.5 5.5L15 13l4 1.5V18a2 2 0 0 1-2 2A14 14 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    pin: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
    filtro: '<path d="M4 6h16l-6 7v5l-4 2v-7z"/>',
    ora: '<circle cx="12" cy="12" r="8"/><path d="M12 7.5V12l3 2"/>',
    lista: '<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>',
    griglia: '<rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/>',
    info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8v.1"/>',
    allerta: '<path d="M12 4l9 16H3z"/><path d="M12 10v4.5M12 17.2v.1"/>',
    chiave: '<path d="M14.5 5.5a4 4 0 0 0 4.9 4.9l-8.9 8.9a2 2 0 0 1-2.8-2.8l8.9-8.9a4 4 0 0 0-2.1-2.1z"/>',
    goccia: '<path d="M12 3.5c4 4.8 6 8 6 10.7a6 6 0 0 1-12 0c0-2.7 2-5.9 6-10.7z"/>',
    fiamma: '<path d="M12 21a6 6 0 0 0 6-6c0-4-3-6-4-10-2 2-3 4-3 6-1-1-1.5-2-1.5-3C7.5 10 6 12.5 6 15a6 6 0 0 0 6 6z"/>',
    clima: '<rect x="3" y="5" width="18" height="7.5" rx="2"/><path d="M7 16v3M12 16v4M17 16v3"/>',
    foto: '<rect x="3" y="6" width="18" height="14" rx="3"/><circle cx="12" cy="13" r="3.5"/><path d="M8.5 6l1.5-2.5h4L15.5 6"/>',
    storico: '<path d="M4 12a8 8 0 1 0 2.6-5.9M4 4.5V8h3.5"/><path d="M12 8v4l3 2"/>',
    auto: '<path d="M4 16v-4l2-5h12l2 5v4z"/><path d="M4 12h16"/><circle cx="8" cy="16.5" r="1.8"/><circle cx="16" cy="16.5" r="1.8"/>',
    tazza: '<path d="M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z"/><path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16M8.5 3.5v2.5M12.5 3.5v2.5"/>',
    carta: '<rect x="3" y="6" width="18" height="12.5" rx="2.5"/><path d="M3 10.5h18M7 15h4"/>',
    bolle: '<circle cx="9" cy="13" r="5"/><circle cx="17" cy="8" r="3"/><circle cx="17.5" cy="17" r="2"/>',
    barca: '<path d="M3 16h18l-3 4H6z"/><path d="M12 3v11M12 4l6 9h-6"/>',
    vento: '<path d="M3 9h11a3 3 0 1 0-3-3M3 14h15a3 3 0 1 1-3 3M3 19h6"/>',
    sole: '<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"/>',
    persone: '<circle cx="9" cy="8.5" r="3.2"/><path d="M3 19.5c.6-3.3 3-5 6-5s5.4 1.7 6 5M16 5.3a3.2 3.2 0 0 1 0 6.2M18 14.8c1.7.7 2.7 2.2 3 4.7"/>',
    euro: '<path d="M17 6.5A6.5 6.5 0 1 0 17 17.5M4 10.5h9M4 13.5h9"/>',
    doc: '<path d="M7 3.5h7l4 4V20.5H7z"/><path d="M14 3.5v4h4M10 12.5h5M10 16h5"/>',
    scudo: '<path d="M12 3.5l7 3v5c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9v-5z"/><path d="M9 12l2 2 4-4"/>',
    chat: '<path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 3.5V17A2.5 2.5 0 0 1 4 14.5z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 6.5 12 13l8.5-6.5"/>',
    pianta: '<rect x="3.5" y="4" width="17" height="16" rx="1.5"/><path d="M12 4v9H3.5M12 9h8.5M16 9v11"/>',
    stella: '<path d="M12 4l2.4 5 5.4.7-4 3.8 1 5.3-4.8-2.6-4.8 2.6 1-5.3-4-3.8 5.4-.7z"/>'
  };
  function ic(k) { return '<svg class="x-ic" viewBox="0 0 24 24" aria-hidden="true">' + (IC[k] || '') + '</svg>'; }
  function esc(s) { return NX.esc(s); }
  function euro(n, dec) {
    var v = Math.round(n * 100) / 100;
    return (dec || v % 1 ? v.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : v.toLocaleString('it-IT')) + ' €';
  }
  function memoria(pref) {
    return {
      get: function (k, def) { try { var v = localStorage.getItem(pref + '-' + k); return v ? JSON.parse(v) : def; } catch (e) { return def; } },
      set: function (k, v) { try { localStorage.setItem(pref + '-' + k, JSON.stringify(v)); } catch (e) {} },
      azzera: function () { try { Object.keys(localStorage).forEach(function (k) { if (k.indexOf(pref + '-') === 0) localStorage.removeItem(k); }); } catch (e) {} }
    };
  }
  var GG = ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'];
  var GGL = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var MM = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];
  var MML = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
  function giorno(k) { var g = new Date(); g.setHours(12, 0, 0, 0); g.setDate(g.getDate() + k); return g; }
  var ridotto = function () { return window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches; };

  /* promemoria da aggiungere al calendario del telefono (file .ics creato nel browser) */
  function calendario(file, titoloEv, inizio, minuti, luogo, nota) {
    var p = function (n) { return ('0' + n).slice(-2); };
    var f = function (t) { return t.getFullYear() + p(t.getMonth() + 1) + p(t.getDate()) + 'T' + p(t.getHours()) + p(t.getMinutes()) + '00'; };
    var fine = new Date(inizio.getTime() + minuti * 60000);
    var e = function (s) { return String(s || '').replace(/[\\,;]/g, function (c) { return '\\' + c; }); };
    var tx = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Noxford demo//IT', 'BEGIN:VEVENT', 'UID:' + Date.now() + '@demo', 'DTSTAMP:' + f(new Date()), 'DTSTART:' + f(inizio), 'DTEND:' + f(fine),
      'SUMMARY:' + e(titoloEv), 'LOCATION:' + e(luogo), 'DESCRIPTION:' + e(nota), 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    var a = d.createElement('a'), u = URL.createObjectURL(new Blob([tx], { type: 'text/calendar;charset=utf-8' }));
    a.href = u; a.download = file; a.style.display = 'none'; d.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(u); a.remove(); }, 800);
  }

  var C = null, stile = 'a', vistaCor = null, parCor = null, prefToccata = false, segs = [];
  function $(s) { return d.querySelector(s); }

  function leggiHash() {
    var p = location.hash.replace(/^#\/?/, '').split('/');
    var n = C.viste[p[0]] ? p[0] : C.home;
    return { n: n, par: p[1] ? decodeURIComponent(p[1]) : null };
  }
  function titolo(v) { return typeof v.tit === 'function' ? v.tit(parCor) : v.tit; }
  function disegna(verso, anim) {
    var box = $('#x-vista'), v = C.viste[vistaCor], h = v.render(parCor);
    if (h.indexOf('<h1') < 0) h = '<h1 class="nx-tit-grande x-tit">' + esc(titolo(v)) + '</h1>' + h;
    if (anim) NX.vista(box, h, verso); else box.innerHTML = h;
    if (v.dopo) v.dopo(box, parCor);
  }
  function barra() {
    var v = C.viste[vistaCor], t = titolo(v), tab = v.tab || vistaCor;
    $('#x-pic').textContent = t;
    var sx = $('#x-sx');
    if (v.indietro) {
      var ind = typeof v.indietro === 'function' ? v.indietro(parCor) : v.indietro;
      sx.innerHTML = '<a class="nx-btn t x-indietro" href="' + ind[0] + '">' + ic('sx') + '<span>' + esc(ind[1]) + '</span></a>';
    } else sx.innerHTML = C.marchio;
    $('#x-dx-app').innerHTML = C.destra ? C.destra() : '';
    d.querySelectorAll('[data-t]').forEach(function (a) { if (a.getAttribute('data-t') === tab) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    var fab = $('#x-fab'); if (fab && C.fab) fab.classList.toggle('x-fab-via', C.fab[0] === '#/' + vistaCor);
    d.title = t + ' · ' + C.nome + ' (app dimostrativa) | Noxford Agency';
  }
  function mostra(anim) {
    var h = leggiHash(), v = C.viste[h.n], prima = vistaCor ? C.viste[vistaCor] : null;
    var lp = prima ? (prima.livello || 0) : 0, lv = v.livello || 0;
    if (prima && prima.lascia) prima.lascia();
    vistaCor = h.n; parCor = h.par;
    while (NX.foglio.aperto()) NX.foglio.chiudi();
    disegna(lv > lp ? 'dx' : lv < lp ? 'sx' : null, anim && !ridotto());
    barra();
    window.scrollTo(0, 0);
  }
  function ridisegna() {
    var y = window.scrollY;
    disegna(null, false); barra();
    window.scrollTo(0, y);
  }
  function scriviUrl() {
    var p = new URLSearchParams(location.search);
    p.set('stile', stile);
    if (prefToccata) { p.set('tema', NX.pref.temaAttivo()); p.set('vetro', NX.pref.vetroAttivo() ? 'si' : 'no'); }
    try { history.replaceState(null, '', location.pathname + '?' + p.toString() + location.hash); } catch (e) {}
  }
  function cambiaStile(v) {
    if (!/^[abc]$/.test(v)) return;
    stile = v; root.setAttribute('data-stile', v);
    segs.forEach(function (s) { s.api.scegli(v); });
    d.querySelectorAll('.x-c-d').forEach(function (el) { el.textContent = C.stili[v][1]; });
    scriviUrl(); ridisegna();
  }
  function controlli() {
    return '<div class="nx-campo"><span>Stile dell\'app</span><div class="nx-seg pieno x-c-s" role="group" aria-label="Stile dell\'app">' +
      ['a', 'b', 'c'].map(function (k) { return '<button type="button" data-v="' + k + '" aria-pressed="' + (k === stile) + '">' + C.stili[k][0] + '</button>'; }).join('') +
      '</div><small class="x-c-d">' + esc(C.stili[stile][1]) + '</small></div>' +
      '<ul class="nx-lista x-c-l"><li><label class="nx-cella nx-toggle x-tg"><span>Tema scuro</span><input type="checkbox" class="x-c-t"><i></i></label></li>' +
      '<li><label class="nx-cella nx-toggle x-tg"><span>Effetto vetro</span><input type="checkbox" class="x-c-v"><i></i></label></li></ul>' +
      '<button type="button" class="nx-btn pieno x-c-z">Azzera i dati della demo</button>';
  }
  function collega(box) {
    var s = box.querySelector('.x-c-s');
    var api = NX.seg(s, function (v) { cambiaStile(v); });
    segs = segs.filter(function (x) { return d.body.contains(x.el); });
    segs.push({ el: s, api: api });
    NX.pref.collega(box.querySelector('.x-c-t'), 'tema');
    NX.pref.collega(box.querySelector('.x-c-v'), 'vetro');
    box.querySelector('.x-c-z').addEventListener('click', function () {
      C.mem.azzera(); if (C.azzera) C.azzera();
      NX.foglio.chiudi(); ridisegna(); NX.toast('Dati della demo azzerati.');
    });
  }
  function opzioni() {
    var f = NX.foglio.apri({ titolo: 'Opzioni della demo', html: controlli() + '<p class="x-nota">' + esc(C.striscia) + '. Le scelte restano solo in questo browser.</p>' });
    collega(f);
  }

  function avvia(conf) {
    C = conf; C.mem = C.mem || memoria(conf.chiave);
    stile = /^[abc]$/.test(q.get('stile') || '') ? q.get('stile') : 'a';
    root.setAttribute('data-stile', stile);
    NX.pref.init();
    if (q.get('tema')) NX.pref.tema(q.get('tema'), { salva: false });
    if (q.get('vetro')) NX.pref.vetro(q.get('vetro') !== 'no', { salva: false });
    d.addEventListener('nx:pref', function () { prefToccata = true; scriviUrl(); });
    var tab = C.tab.map(function (t) { return '<a href="#/' + t[0] + '" data-t="' + t[0] + '">' + ic(t[2]) + '<span>' + esc(t[1]) + '</span></a>'; }).join('');
    $('#x-tab').innerHTML = tab;
    $('#x-sez').innerHTML = C.tab.map(function (t) { return '<a class="nx-chip" href="#/' + t[0] + '" data-t="' + t[0] + '">' + esc(t[1]) + '</a>'; }).join('');
    if (C.fab) $('#x-fab').outerHTML = '<a class="nx-btn p flott x-fab" id="x-fab" href="' + C.fab[0] + '">' + ic(C.fab[2]) + '<span>' + esc(C.fab[1]) + '</span></a>';
    var lato = $('#x-lato-opz'); if (lato) { lato.innerHTML = controlli(); collega(lato); }
    $('#x-opz').addEventListener('click', opzioni);
    NX.titoloGrande($('#x-bar'), 24);
    window.addEventListener('hashchange', function () { mostra(true); });
    mostra(false);
  }

  return {
    avvia: avvia, memoria: memoria, ridisegna: ridisegna, ic: ic, calendario: calendario, esc: esc, euro: euro, giorno: giorno,
    GG: GG, GGL: GGL, MM: MM, MML: MML, ridotto: ridotto,
    stile: function () { return stile; },
    vista: function () { return vistaCor; },
    vai: function (h) { if (location.hash === h) mostra(true); else location.hash = h; }
  };
})();

/* =====================================================================
   Ardesia Case - app dimostrativa di un'agenzia immobiliare inventata.
   Preferiti, ricerca salvata e visite restano in questo browser.
   ===================================================================== */
(function () {
  'use strict';
  var d = document, ic = X.ic, esc = X.esc, euro = X.euro, GG = X.GG, GGL = X.GGL, MM = X.MM, MML = X.MML, giorno = X.giorno;
  var IMM = [
    { id: 'a12', con: 'vendita', z: 'Centro storico', n: 'Trilocale con parquet in via dei Tessitori', p: 238000, mq: 92, loc: 3, bagni: 1, piano: '2° con ascensore', cl: 'C', anno: 1962, img: 'img/soggiorno.webp', w: 1200, h: 896, alt: 'Soggiorno con parquet a spina di pesce, divano grigio chiaro e grande finestra', x: 168, y: 92, nuovo: 1, desc: 'Ristrutturato nel 2023: impianto elettrico nuovo, infissi doppi, parquet originale recuperato. Soggiorno con due finestre sulla via, cucina abitabile, due camere.', vic: [['Scuola primaria', '4 min a piedi'], ['Fermata bus 3', '2 min a piedi'], ['Mercato coperto', '6 min a piedi'], ['Stazione', '12 min a piedi']] },
    { id: 'b07', con: 'vendita', z: 'Campagna', n: 'Casa in pietra con giardino a Poggio Sereno', p: 345000, mq: 160, loc: 5, bagni: 2, piano: 'Indipendente su 2 livelli', cl: 'E', anno: 1930, img: 'img/casa.webp', w: 1100, h: 821, alt: 'Casa in pietra con giardino verde e cancello in legno', x: 300, y: 150, nuovo: 1, desc: 'Casa indipendente con 1.200 mq di giardino, forno a legna e magazzino. Tetto rifatto; da sistemare bagni e caldaia, come scritto nella scheda tecnica.', vic: [['Paese più vicino', '5 min in auto'], ['Scuolabus', 'passa davanti'], ['Superstrada', '9 min in auto'], ['Farmacia', '6 min in auto']] },
    { id: 'c03', con: 'vendita', z: 'Colle Alto', n: 'Attico con terrazzo e cucina a isola', p: 415000, mq: 118, loc: 4, bagni: 2, piano: '5° e ultimo, ascensore', cl: 'A2', anno: 2019, img: 'img/cucina.webp', w: 1200, h: 896, alt: 'Cucina moderna con isola aperta su un terrazzo con vista sui tetti', x: 82, y: 54, desc: 'Terrazzo di 40 mq sui tetti, cucina a isola aperta sul soggiorno, riscaldamento a pavimento e pannelli solari condominiali. Box auto incluso.', vic: [['Parco del Colle', '3 min a piedi'], ['Scuola media', '8 min a piedi'], ['Fermata bus 7', '1 min a piedi'], ['Ospedale', '10 min in auto']] },
    { id: 'd21', con: 'vendita', z: 'Borgo Fiume', n: 'Bilocale vicino al lungofiume', p: 129000, mq: 55, loc: 2, bagni: 1, piano: '1° senza ascensore', cl: 'D', anno: 1975, x: 210, y: 170, desc: 'Ideale come prima casa o da mettere a reddito. Cantina e posto bici in cortile.', vic: [['Lungofiume', '1 min a piedi'], ['Università', '9 min in bici'], ['Supermercato', '3 min a piedi'], ['Fermata bus 3', '4 min a piedi']] },
    { id: 'e15', con: 'affitto', z: 'Centro storico', n: 'Monolocale arredato in vicolo San Biagio', p: 620, mq: 34, loc: 1, bagni: 1, piano: 'Piano terra rialzato', cl: 'F', anno: 1910, x: 140, y: 110, nuovo: 1, desc: 'Arredato, spese condominiali comprese. Contratto 4+4, si chiedono due mensilità di deposito.', vic: [['Piazza grande', '2 min a piedi'], ['Fermata bus 1', '3 min a piedi'], ['Palestra', '5 min a piedi'], ['Stazione', '10 min a piedi']] },
    { id: 'f09', con: 'affitto', z: 'Borgo Fiume', n: 'Trilocale con balcone e posto auto', p: 850, mq: 80, loc: 3, bagni: 1, piano: '3° con ascensore', cl: 'C', anno: 1988, x: 236, y: 150, desc: 'Non arredato, cucina a vista, due camere, balcone verso il fiume. Libero dal mese prossimo.', vic: [['Asilo nido', '5 min a piedi'], ['Supermercato', '2 min a piedi'], ['Fermata bus 3', '3 min a piedi'], ['Parco fluviale', '4 min a piedi']] },
    { id: 'g30', con: 'vendita', z: 'Colle Alto', n: 'Quadrilocale con giardino condominiale', p: 289000, mq: 125, loc: 4, bagni: 2, piano: '1° con ascensore', cl: 'B', anno: 2008, x: 60, y: 90, desc: 'Tre camere, doppi servizi, cantina e garage. Giardino condominiale curato, con giochi per bambini.', vic: [['Scuola primaria', '6 min a piedi'], ['Parco del Colle', '5 min a piedi'], ['Fermata bus 7', '3 min a piedi'], ['Centro', '12 min in bus']] }
  ];
  var ZONE = ['Centro storico', 'Borgo Fiume', 'Colle Alto', 'Campagna'];
  var ORE = ['9:30', '10:30', '11:30', '12:30', '15:00', '16:00', '17:00', '18:00'];
  var TASSO = 3.2;
  var mem = X.memoria('ardesia'), st, filtro, ord = 'nuovi', vis, fatto = null, mutuo = { ant: 20, anni: 25 };

  function carica() {
    st = mem.get('stato', { pref: ['c03'], vis: [], ric: null });
    filtro = mem.get('filtro', { con: 'vendita', zona: 'tutte', max: 0, loc: 1 });
    vis = { id: null, g: 1, ora: null, tipo: 'presenza' };
    fatto = null;
  }
  var salva = function () { mem.set('stato', st); mem.set('filtro', filtro); var b = d.getElementById('a-n-pref'); if (b) b.textContent = st.pref.length; };
  var byId = function (id) { return IMM.filter(function (i) { return i.id === id; })[0]; };
  var prezzo = function (i) { return i.con === 'affitto' ? euro(i.p) + '<small> al mese</small>' : euro(i.p); };
  var locali = function (n) { return n + (n === 1 ? ' locale' : ' locali'); };
  var salvato = function (id) { return st.pref.indexOf(id) >= 0; };

  /* disegni al posto delle foto mancanti: facciata e planimetria */
  function facciata(i) {
    var piani = Math.min(5, Math.max(1, i.loc)), w = '';
    for (var r = 0; r < piani; r++) for (var c = 0; c < 4; c++) w += '<rect x="' + (112 + c * 26) + '" y="' + (150 - (r + 1) * 22) + '" width="14" height="14" rx="1.5" fill="#F4F1EC" opacity="' + (0.6 + ((r + c + i.mq) % 3) * 0.15) + '"/>';
    return '<svg class="a-ill" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Disegno della facciata"><rect width="320" height="180" fill="#E4DFD6"/><rect x="100" y="' + (150 - piani * 22 - 10) + '" width="120" height="' + (piani * 22 + 10) + '" fill="#3E5566"/>' + w + '<rect x="150" y="136" width="20" height="14" fill="#B5523B"/><rect y="150" width="320" height="30" fill="#CFC6B8"/></svg>';
  }
  function pianta(i) {
    var s = '<svg class="a-ill" viewBox="0 0 320 240" role="img" aria-label="Planimetria indicativa con ' + locali(i.loc) + '"><rect width="320" height="240" fill="#FFFFFF"/><g fill="none" stroke="#1F2A33" stroke-width="4"><rect x="30" y="24" width="260" height="192"/>';
    if (i.loc >= 2) s += '<path d="M170 24v120M30 144h140"/>';
    if (i.loc >= 3) s += '<path d="M170 100h120"/>';
    if (i.loc >= 4) s += '<path d="M230 100v116"/>';
    s += '</g><g font-family="Manrope, sans-serif" font-size="13" fill="#4A545C"><text x="48" y="80">Soggiorno</text>' + (i.loc >= 2 ? '<text x="190" y="66">Camera</text>' : '') + (i.loc >= 3 ? '<text x="182" y="160">Camera</text>' : '') + '<text x="48" y="186">' + (i.bagni > 1 ? 'Cucina e bagni' : 'Cucina e bagno') + '</text></g><text x="290" y="236" text-anchor="end" font-family="Manrope, sans-serif" font-size="11" fill="#8A3B29">' + i.mq + ' mq · disegno indicativo</text></svg>';
    return s;
  }
  function mappa(i) {
    return '<svg class="a-ill" viewBox="0 0 360 210" role="img" aria-label="Mappa stilizzata della zona ' + i.z + '"><rect width="360" height="210" fill="#ECE7DE"/><path d="M0 178C80 160 150 196 230 172s100-20 130-12v50H0z" fill="#BFD3DC"/><g stroke="#FFFFFF" stroke-width="9" fill="none"><path d="M0 70h360M120 0v210M0 130c90-8 180 6 360-12M250 0l-40 210"/></g><g stroke="#FFFFFF" stroke-width="4" fill="none"><path d="M40 0v150M190 0v210M0 30h360M300 0v170"/></g><rect x="20" y="86" width="80" height="34" rx="3" fill="#C9D8BF"/><text x="28" y="107" font-family="Manrope, sans-serif" font-size="12" fill="#3F6449">Parco</text><text x="250" y="196" font-family="Manrope, sans-serif" font-size="12" fill="#2F4452">Fiume</text><circle cx="' + i.x + '" cy="' + i.y + '" r="26" fill="#B5523B" opacity=".18"/><path d="M' + i.x + ' ' + (i.y + 14) + 'c-10-12-14-18-14-24a14 14 0 0 1 28 0c0 6-4 12-14 24z" fill="#B5523B"/><circle cx="' + i.x + '" cy="' + (i.y - 10) + '" r="5" fill="#fff"/></svg>';
  }
  function foto(i, cls, lazy) {
    return i.img ? '<img class="' + cls + '" src="' + i.img + '" alt="' + esc(i.alt) + '" width="' + i.w + '" height="' + i.h + '"' + '' + ' decoding="async">' : '<span class="' + cls + ' a-svg">' + facciata(i) + '</span>';
  }
  function cuore(i, extra) {
    var f = salvato(i.id);
    return '<button type="button" class="a-cuore' + (extra || '') + '" data-a-pref="' + i.id + '" aria-pressed="' + f + '" aria-label="' + (f ? 'Togli dai salvati: ' : 'Salva: ') + esc(i.n) + '">' + ic('cuore') + '</button>';
  }

  /* tre modi di mostrare un immobile, uno per stile */
  function riga(i) {
    return '<li class="a-riga"><a class="nx-cella" href="#/immobile/' + i.id + '">' + foto(i, 'x-thumb') +
      '<span class="nx-c-tx"><b>' + esc(i.n) + '</b><small>' + i.mq + ' mq · ' + locali(i.loc) + ' · ' + esc(i.z) + '</small><span class="a-pr">' + prezzo(i) + (i.nuovo ? ' <span class="nx-pill acc">Nuovo</span>' : '') + '</span></span><i class="nx-chev"></i></a></li>';
  }
  function scheda(i) {
    return '<li class="a-sch"><a href="#/immobile/' + i.id + '" class="a-sch-a">' + foto(i, 'a-sch-f') +
      '<span class="a-sch-tx"><span class="a-sch-p">' + prezzo(i) + '</span><b>' + esc(i.n) + '</b><small>' + i.mq + ' mq · ' + locali(i.loc) + ' · ' + i.bagni + (i.bagni > 1 ? ' bagni' : ' bagno') + ' · ' + esc(i.z) + '</small></span></a>' +
      (i.nuovo ? '<span class="nx-pill acc a-nuovo">Nuovo</span>' : '') + cuore(i) + '</li>';
  }
  function tessera(i) {
    return '<li class="a-tes"><a href="#/immobile/' + i.id + '">' + foto(i, 'a-tes-f') + '<span class="a-tes-tx"><b class="nx-num">' + prezzo(i) + '</b><small>' + i.mq + ' mq · ' + i.loc + ' loc. · ' + esc(i.z) + '</small></span></a>' + cuore(i, ' pic') + '</li>';
  }
  function elenco(l, vuoto) {
    if (!l.length) return vuoto;
    var s = X.stile();
    if (s === 'b') return '<ul class="a-schede">' + l.map(scheda).join('') + '</ul>';
    if (s === 'c') return '<ul class="a-tessere">' + l.map(tessera).join('') + '</ul>';
    return '<ul class="nx-lista a-lista">' + l.map(riga).join('') + '</ul>';
  }
  function risultati() {
    var l = IMM.filter(function (i) { return i.con === filtro.con && (filtro.zona === 'tutte' || i.z === filtro.zona) && (!filtro.max || i.p <= filtro.max) && i.loc >= filtro.loc; });
    if (ord === 'prezzo') l.sort(function (a, b) { return a.p - b.p; });
    else if (ord === 'mq') l.sort(function (a, b) { return b.mq - a.mq; });
    else l.sort(function (a, b) { return (b.nuovo || 0) - (a.nuovo || 0); });
    return l;
  }
  function maxOpts() {
    var o = filtro.con === 'affitto' ? [0, 600, 800, 1000] : [0, 150000, 250000, 350000, 450000];
    return o.map(function (v) { return '<option value="' + v + '"' + (v === filtro.max ? ' selected' : '') + '>' + (v ? 'Fino a ' + euro(v) : 'Nessun limite') + '</option>'; }).join('');
  }
  function segHtml(cls, lab, voci, val) {
    return '<div class="nx-seg pieno ' + cls + '" role="group" aria-label="' + lab + '">' + voci.map(function (v) { return '<button type="button" data-v="' + v[0] + '" aria-pressed="' + (String(v[0]) === String(val)) + '">' + v[1] + '</button>'; }).join('') + '</div>';
  }
  function moduloCerca() {
    var n = risultati().length;
    var zona = '<select id="a-zona" aria-label="Zona"><option value="tutte">Tutte le zone</option>' + ZONE.map(function (z) { return '<option' + (z === filtro.zona ? ' selected' : '') + '>' + z + '</option>'; }).join('') + '</select>';
    var max = '<select id="a-max" aria-label="Prezzo massimo">' + maxOpts() + '</select>';
    var loc = segHtml('a-seg-loc', 'Locali almeno', [[1, '1+'], [2, '2+'], [3, '3+'], [4, '4+']], filtro.loc);
    var con = segHtml('a-seg-con', 'Contratto', [['vendita', 'Comprare'], ['affitto', 'Affittare']], filtro.con);
    var vai = '<a class="nx-btn p pieno a-vai" href="#/immobili">' + (n ? 'Vedi ' + n + (n === 1 ? ' immobile' : ' immobili') : 'Nessun immobile: allarga i filtri') + '</a>';
    if (X.stile() === 'c') {
      return '<div class="a-cerca-c">' + con + '<div class="a-campi-c"><label class="a-sel"><span>Zona</span>' + zona + '</label><label class="a-sel"><span>Prezzo</span>' + max + '</label></div><p class="x-lab">Locali almeno</p>' + loc + vai + '</div>';
    }
    return '<div class="a-cerca">' + con +
      '<ul class="nx-lista a-campi"><li><label class="nx-cella a-sel"><span class="nx-c-tx"><b>Zona</b></span>' + zona + '</label></li><li><label class="nx-cella a-sel"><span class="nx-c-tx"><b>Prezzo massimo</b></span>' + max + '</label></li></ul>' +
      '<p class="x-lab">Locali almeno</p>' + loc + vai + '</div>';
  }

  /* ---------- viste ---------- */
  function vCerca() {
    var nuovi = IMM.filter(function (i) { return i.nuovo; });
    var s = X.stile();
    if (s === 'b') {
      return '<div class="a-hero"><img src="img/soggiorno.webp" width="1200" height="896" alt="Soggiorno luminoso con parquet a spina di pesce e una grande finestra" fetchpriority="high" decoding="async"><div class="a-hero-tx"><p>Ardesia Case · dal 1998</p><h1 class="a-hero-h">Cerca casa con i filtri che contano davvero.</h1></div></div>' +
        moduloCerca() + '<h2 class="x-h2">Appena arrivati<small>Visti di persona da noi prima di pubblicarli</small></h2>' + elenco(nuovi);
    }
    if (s === 'c') {
      return '<h1 class="nx-tit-grande x-tit">Cerca casa</h1>' + moduloCerca() +
        '<div class="a-rapide"><a href="#/salvati" class="a-rap" data-nx-premi>' + ic('cuore') + '<b>' + st.pref.length + '</b><small>salvati</small></a><a href="#/salvati" class="a-rap" data-nx-premi>' + ic('cal') + '<b>' + st.vis.length + '</b><small>visite</small></a><a href="#/salvati" class="a-rap" data-nx-premi>' + ic('cerca') + '<b>' + (st.ric ? 1 : 0) + '</b><small>avvisi</small></a></div>' +
        '<h2 class="x-h2">Appena arrivati</h2>' + elenco(nuovi);
    }
    return '<h1 class="nx-tit-grande x-tit">Cerca casa</h1>' + moduloCerca() + '<h2 class="x-h2">Appena arrivati</h2>' + elenco(nuovi);
  }
  function vImmobili() {
    var l = risultati();
    var ch = [['con', filtro.con === 'vendita' ? 'In vendita' : 'In affitto', 1]];
    if (filtro.zona !== 'tutte') ch.push(['zona', filtro.zona]);
    if (filtro.max) ch.push(['max', 'Fino a ' + euro(filtro.max)]);
    if (filtro.loc > 1) ch.push(['loc', 'Da ' + filtro.loc + ' locali']);
    var chips = '<div class="nx-chips a-chips" role="group" aria-label="Filtri attivi">' + ch.map(function (c) { return '<button type="button" class="nx-chip" data-a-chip="' + c[0] + '" aria-pressed="true" aria-label="' + (c[2] ? 'Cambia in ' + (filtro.con === 'vendita' ? 'affitto' : 'vendita') : 'Togli il filtro ' + esc(c[1])) + '">' + esc(c[1]) + (c[2] ? ' ⇄' : ' ✕') + '</button>'; }).join('') +
      '<a class="nx-chip a-chip-mod" href="#/cerca">' + ic('filtro') + 'Filtri</a></div>';
    var barra = '<div class="a-ord"><p aria-live="polite">' + l.length + (l.length === 1 ? ' immobile' : ' immobili') + '</p><label><span class="nx-sr">Ordina per</span><select id="a-ord"><option value="nuovi"' + (ord === 'nuovi' ? ' selected' : '') + '>Più recenti</option><option value="prezzo"' + (ord === 'prezzo' ? ' selected' : '') + '>Prezzo più basso</option><option value="mq"' + (ord === 'mq' ? ' selected' : '') + '>Più grandi</option></select></label></div>';
    var vuoto = NX.stato.vuoto('Nessun immobile', 'Con questi filtri non abbiamo niente. Togli un filtro o salva la ricerca: ti scriviamo quando entra.', ['Togli tutti i filtri', 'a-reset']);
    return '<h1 class="nx-tit-grande x-tit">Immobili</h1>' + chips + barra + '<div id="a-ris">' + elenco(l, vuoto) + '</div>';
  }
  function rata(i) {
    var cap = i.p * (1 - mutuo.ant / 100), r = TASSO / 100 / 12, n = mutuo.anni * 12;
    return cap * r / (1 - Math.pow(1 + r, -n));
  }
  function bloccoMutuo(i) {
    return '<div class="x-card x-pad a-mutuo" id="a-mutuo"><div class="a-mu-top"><span><small>Rata indicativa del mutuo</small><b class="nx-num" id="a-rata">' + euro(Math.round(rata(i))) + '<small> al mese</small></b></span><span class="x-ico-q">' + ic('euro') + '</span></div>' +
      '<label class="a-range"><span>Anticipo <b id="a-ant-v">' + mutuo.ant + '% · ' + euro(Math.round(i.p * mutuo.ant / 100)) + '</b></span><input type="range" id="a-ant" min="10" max="50" step="5" value="' + mutuo.ant + '"></label>' +
      '<p class="x-lab">Durata</p>' + segHtml('a-seg-anni', 'Durata del mutuo', [[20, '20 anni'], [25, '25 anni'], [30, '30 anni']], mutuo.anni) +
      '<p class="x-nota">Tasso fisso di esempio ' + String(TASSO).replace('.', ',') + '%. Spese, assicurazioni e perizia sono a parte: la cifra vera la dà la banca.</p></div>';
  }
  function vImmobile(id) {
    var i = byId(id) || IMM[0], f = salvato(i.id);
    var sl = [i.img ? '<img src="' + i.img + '" alt="' + esc(i.alt) + '" width="' + i.w + '" height="' + i.h + '" decoding="async">' : facciata(i), pianta(i), mappa(i)];
    var nomiSl = ['Foto', 'Planimetria', 'Mappa'];
    return '<div class="a-gal"><div class="a-gal-t" id="a-gal" tabindex="0" aria-label="Galleria: foto, planimetria e mappa">' + sl.map(function (s) { return '<div class="a-sl">' + s + '</div>'; }).join('') + '</div>' +
      '<div class="a-gal-n" role="group" aria-label="Scegli cosa vedere">' + nomiSl.map(function (n, k) { return '<button type="button" data-a-sl="' + k + '" aria-pressed="' + (k === 0) + '">' + n + '</button>'; }).join('') + '</div></div>' +
      '<p class="a-rif">Rif. ' + i.id.toUpperCase() + ' · ' + esc(i.z) + '</p><h1 class="a-tit-imm">' + esc(i.n) + '</h1><p class="a-pr-g nx-num">' + prezzo(i) + '</p>' +
      '<div class="x-dati"><div><b>' + i.mq + '</b><small>mq</small></div><div><b>' + i.loc + '</b><small>locali</small></div><div><b>' + i.bagni + '</b><small>' + (i.bagni > 1 ? 'bagni' : 'bagno') + '</small></div><div><b>' + i.cl + '</b><small>classe</small></div></div>' +
      '<p class="a-desc">' + esc(i.desc) + '</p>' +
      '<ul class="x-kv"><li><span>Piano</span><span>' + esc(i.piano) + '</span></li><li><span>Anno</span><span>' + i.anno + '</span></li><li><span>Contratto</span><span>' + (i.con === 'vendita' ? 'Vendita' : 'Affitto 4+4') + '</span></li></ul>' +
      (i.con === 'vendita' ? '<h2 class="x-h2">Quanto pagheresti al mese</h2>' + bloccoMutuo(i) : '') +
      '<h2 class="x-h2">La zona<small>Posizione indicativa: l\'indirizzo preciso lo diamo alla visita</small></h2><ul class="x-kv a-vicino">' + i.vic.map(function (v) { return '<li><span>' + esc(v[0]) + '</span><span>' + esc(v[1]) + '</span></li>'; }).join('') + '</ul>' +
      '<h2 class="x-h2">Chi lo segue</h2><ul class="nx-lista"><li><div class="nx-cella"><span class="nx-av" aria-hidden="true">GL</span><span class="nx-c-tx"><b>Giulia Lentini</b><small>Risponde in giornata, sabato compreso</small></span></div></li>' +
      '<li><a class="nx-cella ic" href="' + mailto(i) + '"><span class="nx-c-ic">' + NX.icona('mail') + '</span><span class="nx-c-tx"><b>Scrivi a Giulia</b><small>Il messaggio è già pronto, cambialo se vuoi</small></span><i class="nx-chev"></i></a></li></ul>' +
      '<div class="x-azioni"><a class="nx-btn p" href="#/visita/' + i.id + '">' + ic('cal') + 'Prenota una visita</a><button type="button" class="nx-btn" data-a-pref="' + i.id + '" aria-pressed="' + f + '">' + ic('cuore') + '<span>' + (f ? 'Salvato' : 'Salva') + '</span></button></div>';
  }
  function mailto(i) {
    var corpo = 'Buongiorno Giulia,\nmi interessa l\'immobile "' + i.n + '" (rif. ' + i.id.toUpperCase() + ', ' + i.z + ').\nVorrei sapere le spese condominiali e se è possibile vederlo questa settimana.\n\nGrazie';
    return 'mailto:giulia@ardesiacase.example?subject=' + encodeURIComponent('Richiesta informazioni rif. ' + i.id.toUpperCase()) + '&body=' + encodeURIComponent(corpo);
  }
  function primoGiorno() { for (var k = 1; k < 9; k++) if (giorno(k).getDay() !== 0) return k; return 1; }
  function occupato(g, k) { var gd = giorno(g); return (gd.getDay() === 6 && k > 3) || ((gd.getDate() + k * 3) % 4 === 0); }
  function vVisita(id) {
    if (id && byId(id) && id !== vis.id) { vis.id = id; vis.ora = null; }
    if (!vis.id) vis.id = st.pref[0] || 'a12';
    if (giorno(vis.g).getDay() === 0) vis.g = primoGiorno();
    var i = byId(vis.id);
    if (fatto) {
      var dd = giorno(fatto.g);
      return '<h1 class="nx-tit-grande x-tit">Prenota una visita</h1><div class="x-card x-fatto nx-scala"><span class="x-spunta">' + ic('ok') + '</span><h2>Visita fissata, ' + esc(fatto.nome) + '.</h2><p>' + GGL[dd.getDay()] + ' ' + dd.getDate() + ' ' + MML[dd.getMonth()] + ' alle ' + fatto.ora + (fatto.tipo === 'video' ? ', in videochiamata.' : ', davanti al portone.') + '</p><p>' + esc(byId(fatto.id).n) + '</p><p>Ti accompagna Giulia. Se vuoi fare una proposta, porta un documento.</p></div>' +
        '<div class="x-azioni"><button type="button" class="nx-btn p" data-a="ics">' + ic('cal') + 'Aggiungi al calendario</button><a class="nx-btn" href="#/salvati">Vedi le mie visite</a><button type="button" class="nx-btn t" data-a="altra">Prenota un\'altra visita</button></div>';
    }
    var g = '';
    for (var k = 1; k <= 12; k++) { var dg = giorno(k), chiuso = dg.getDay() === 0; g += '<button type="button" data-a-g="' + k + '" aria-pressed="' + (k === vis.g) + '"' + (chiuso ? ' disabled aria-label="' + GGL[dg.getDay()] + ' ' + dg.getDate() + ', agenzia chiusa"' : ' aria-label="' + GGL[dg.getDay()] + ' ' + dg.getDate() + ' ' + MML[dg.getMonth()] + '"') + '><small>' + (k === 1 ? 'domani' : GG[dg.getDay()]) + '</small><b>' + dg.getDate() + '</b></button>'; }
    var o = ORE.map(function (h, k) { var occ = occupato(vis.g, k); if (occ && vis.ora === h) vis.ora = null; return '<button type="button" data-a-ora="' + h + '" aria-pressed="' + (vis.ora === h) + '"' + (occ ? ' disabled aria-label="' + h + ', già occupato"' : '') + '>' + h + '</button>'; }).join('');
    var opz = IMM.map(function (x) { return '<option value="' + x.id + '"' + (x.id === vis.id ? ' selected' : '') + '>' + esc(x.n) + '</option>'; }).join('');
    return '<h1 class="nx-tit-grande x-tit">Prenota una visita</h1>' +
      '<div class="x-card a-mini">' + foto(i, 'a-mini-f') + '<span><b>' + esc(i.n) + '</b><small>' + esc(i.z) + ' · ' + (i.con === 'vendita' ? euro(i.p) : euro(i.p) + ' al mese') + '</small></span></div>' +
      '<label class="nx-campo a-camb"><span>Cambia immobile</span><select id="a-vis-imm">' + opz + '</select></label>' +
      '<p class="x-lab">Giorno</p><div class="x-giorni" role="group" aria-label="Giorno">' + g + '</div>' +
      '<p class="x-lab">Orario</p><div class="x-orari" role="group" aria-label="Orario">' + o + '</div>' +
      '<p class="x-lab">Come preferisci</p>' + segHtml('a-seg-tipo', 'Tipo di visita', [['presenza', 'Di persona'], ['video', 'Videochiamata']], vis.tipo) +
      '<label class="nx-campo a-nome"><span>Il tuo nome</span><input id="a-nome" autocomplete="given-name" placeholder="Come ti chiami" value="' + esc(vis.nome || '') + '"></label>' +
      '<p class="x-err" id="a-err" role="alert"></p>' +
      '<div class="x-azioni"><button type="button" class="nx-btn p" data-a="conferma">Conferma la visita</button></div>' +
      '<p class="x-nota">Demo: non inviamo nulla. Nella versione vera la visita entra nell\'agenda di Giulia e ti arriva un promemoria il giorno prima.</p>';
  }
  function vSalvati() {
    var l = IMM.filter(function (i) { return salvato(i.id); });
    var vuoto = NX.stato.vuoto('Ancora niente', 'Tocca il cuore su un immobile e lo ritrovi qui.', ['Guarda gli immobili', 'a-vai-imm']);
    var ric = st.ric ? '<p class="a-ric-t">' + ic('ok') + '<span>Ti scriviamo per: <b>' + esc(st.ric) + '</b></span></p><div class="a-ric-b"><button type="button" class="nx-btn" data-a="ric">Aggiorna con i filtri attuali</button><button type="button" class="nx-btn t r" data-a="ric-via">Togli</button></div>'
      : '<p class="a-ric-t">' + ic('info') + '<span>Nessuna ricerca salvata. Ti scriviamo solo quando entra un immobile adatto, niente pubblicità.</span></p><div class="a-ric-b"><button type="button" class="nx-btn p" data-a="ric">Salva la ricerca attuale</button></div>';
    var vv = st.vis.length ? '<ul class="nx-lista">' + st.vis.map(function (v, k) { return '<li><div class="nx-cella"><span class="a-data"><small>' + v.gs + '</small><b>' + v.gn + '</b></span><span class="nx-c-tx"><b>' + esc(v.n) + '</b><small>alle ' + v.ora + ' · ' + (v.tipo === 'video' ? 'videochiamata' : 'di persona') + '</small></span><button type="button" class="nx-btn t r" data-a-annulla="' + k + '">Annulla</button></div></li>'; }).join('') + '</ul>'
      : '<div class="x-card">' + NX.stato.vuoto('Nessuna visita', 'Prenota dalla scheda di un immobile: ci vogliono venti secondi.') + '</div>';
    return '<h1 class="nx-tit-grande x-tit">Salvati</h1>' + elenco(l, '<div class="x-card">' + vuoto + '</div>') +
      '<h2 class="x-h2">Avvisami quando arriva</h2><div class="x-card x-pad a-ric">' + ric + '</div>' +
      '<h2 class="x-h2">Visite prenotate</h2>' + vv;
  }

  function descRic() { return (filtro.con === 'vendita' ? 'vendita' : 'affitto') + ', ' + (filtro.zona === 'tutte' ? 'tutte le zone' : filtro.zona) + (filtro.max ? ', fino a ' + euro(filtro.max) : '') + ', da ' + locali(filtro.loc); }
  function aggiornaCerca() { var b = d.querySelector('.a-vai'); if (!b) return; var n = risultati().length; b.textContent = n ? 'Vedi ' + n + (n === 1 ? ' immobile' : ' immobili') : 'Nessun immobile: allarga i filtri'; var m = d.getElementById('a-max'); if (m) m.innerHTML = maxOpts(); }

  function dopoCerca(box) {
    NX.seg(box.querySelector('.a-seg-con'), function (v) { filtro.con = v; filtro.max = 0; salva(); aggiornaCerca(); });
    NX.seg(box.querySelector('.a-seg-loc'), function (v) { filtro.loc = +v; salva(); aggiornaCerca(); });
  }
  function dopoImmobile(box, id) {
    var i = byId(id) || IMM[0], t = box.querySelector('#a-gal');
    var tm = null;
    t.addEventListener('scroll', function () { clearTimeout(tm); tm = setTimeout(function () { var k = Math.round(t.scrollLeft / t.clientWidth); box.querySelectorAll('[data-a-sl]').forEach(function (b) { b.setAttribute('aria-pressed', +b.getAttribute('data-a-sl') === k ? 'true' : 'false'); }); }, 60); }, { passive: true });
    var r = box.querySelector('#a-ant');
    if (r) {
      r.addEventListener('input', function () { mutuo.ant = +r.value; d.getElementById('a-ant-v').textContent = mutuo.ant + '% · ' + euro(Math.round(i.p * mutuo.ant / 100)); d.getElementById('a-rata').innerHTML = euro(Math.round(rata(i))) + '<small> al mese</small>'; });
      NX.seg(box.querySelector('.a-seg-anni'), function (v) { mutuo.anni = +v; d.getElementById('a-rata').innerHTML = euro(Math.round(rata(i))) + '<small> al mese</small>'; });
    }
  }
  function dopoVisita(box) {
    var t = box.querySelector('.a-seg-tipo'); if (t) NX.seg(t, function (v) { vis.tipo = v; });
    var sel = box.querySelector('#a-vis-imm'); if (sel) sel.addEventListener('change', function () { vis.id = sel.value; vis.nome = (d.getElementById('a-nome') || {}).value; X.ridisegna(); });
    var n = box.querySelector('#a-nome'); if (n) n.addEventListener('input', function () { vis.nome = n.value; });
    var pg = box.querySelector('[data-a-g][aria-pressed="true"]'); if (pg && pg.scrollIntoView && pg.offsetLeft > 200) pg.parentNode.scrollLeft = pg.offsetLeft - 16;
  }

  d.addEventListener('click', function (e) {
    var b = e.target.closest('button, [data-a]'); if (!b) return;
    var a = b.getAttribute('data-a');
    if (b.hasAttribute('data-a-pref')) {
      var id = b.getAttribute('data-a-pref'), k = st.pref.indexOf(id);
      if (k >= 0) st.pref.splice(k, 1); else st.pref.push(id);
      salva(); var on = salvato(id);
      NX.toast(on ? 'Salvato. Lo ritrovi in Salvati.' : 'Tolto dai salvati.');
      if (X.vista() === 'salvati') X.ridisegna();
      else d.querySelectorAll('[data-a-pref="' + id + '"]').forEach(function (x) {
        x.setAttribute('aria-pressed', on); x.classList.remove('nx-scala'); void x.offsetWidth; x.classList.add('nx-scala');
        var sp = x.querySelector('span'); if (sp) sp.textContent = on ? 'Salvato' : 'Salva';
        if (x.classList.contains('a-cuore')) x.setAttribute('aria-label', (on ? 'Togli dai salvati' : 'Salva'));
      });
      var bb = d.getElementById('a-n-pref'); if (bb) bb.textContent = st.pref.length;
    }
    else if (b.hasAttribute('data-a-chip')) {
      var c = b.getAttribute('data-a-chip');
      if (c === 'con') { filtro.con = filtro.con === 'vendita' ? 'affitto' : 'vendita'; filtro.max = 0; }
      else if (c === 'zona') filtro.zona = 'tutte'; else if (c === 'max') filtro.max = 0; else filtro.loc = 1;
      salva(); X.ridisegna();
    }
    else if (b.getAttribute('data-nx-azione') === 'a-reset') { filtro.zona = 'tutte'; filtro.max = 0; filtro.loc = 1; salva(); X.ridisegna(); }
    else if (b.getAttribute('data-nx-azione') === 'a-vai-imm') X.vai('#/immobili');
    else if (b.hasAttribute('data-a-sl')) { var t = d.getElementById('a-gal'); t.scrollTo({ left: t.clientWidth * +b.getAttribute('data-a-sl'), behavior: X.ridotto() ? 'auto' : 'smooth' }); }
    else if (b.hasAttribute('data-a-g')) { vis.g = +b.getAttribute('data-a-g'); vis.ora = null; X.ridisegna(); }
    else if (b.hasAttribute('data-a-ora')) { vis.ora = b.getAttribute('data-a-ora'); d.querySelectorAll('[data-a-ora]').forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); var er = d.getElementById('a-err'); if (er) er.textContent = ''; }
    else if (b.hasAttribute('data-a-annulla')) { var v = st.vis.splice(+b.getAttribute('data-a-annulla'), 1)[0]; salva(); X.ridisegna(); NX.toast('Visita del ' + v.gn + ' annullata.'); }
    else if (a === 'conferma') {
      var nome = (d.getElementById('a-nome').value || '').trim(), er2 = d.getElementById('a-err');
      if (!vis.ora) { er2.textContent = 'Scegli un orario libero.'; return; }
      if (nome.length < 2) { er2.textContent = 'Scrivi il tuo nome, così Giulia sa chi aspettare.'; d.getElementById('a-nome').focus(); return; }
      var i = byId(vis.id), dg = giorno(vis.g);
      st.vis.unshift({ id: i.id, n: i.n, gs: GG[dg.getDay()], gn: dg.getDate(), g: dg.getTime(), ora: vis.ora, tipo: vis.tipo }); salva();
      fatto = { id: i.id, g: vis.g, ora: vis.ora, tipo: vis.tipo, nome: nome.split(' ')[0] };
      vis.ora = null; X.ridisegna(); window.scrollTo(0, 0);
    }
    else if (a === 'ics' && fatto) {
      var dd = giorno(fatto.g), hm = fatto.ora.split(':'); dd.setHours(+hm[0], +hm[1], 0, 0);
      X.calendario('visita-ardesia.ics', 'Visita: ' + byId(fatto.id).n, dd, 45, byId(fatto.id).z, 'Ti accompagna Giulia di Ardesia Case (demo).');
      NX.toast('Promemoria creato: aprilo per aggiungerlo al calendario.');
    }
    else if (a === 'altra') { fatto = null; X.ridisegna(); }
    else if (a === 'ric') { st.ric = descRic(); salva(); X.ridisegna(); NX.toast('Ricerca salvata.'); }
    else if (a === 'ric-via') { st.ric = null; salva(); X.ridisegna(); }
  });
  d.addEventListener('change', function (e) {
    var t = e.target;
    if (t.id === 'a-zona') { filtro.zona = t.value; salva(); aggiornaCerca(); }
    else if (t.id === 'a-max') { filtro.max = +t.value; salva(); aggiornaCerca(); }
    else if (t.id === 'a-ord') { ord = t.value; var l = risultati(); d.getElementById('a-ris').innerHTML = elenco(l, ''); }
  });

  carica();
  X.avvia({
    chiave: 'ardesia', mem: mem, nome: 'Ardesia Case', home: 'cerca',
    striscia: 'App dimostrativa di un\'attività inventata · Immobili, prezzi e indirizzi sono di esempio · Foto generate con l\'IA',
    marchio: '<a class="x-marchio" href="#/cerca" aria-label="Ardesia Case, torna alla ricerca"><svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" fill="#3E5566"/><path d="M7 16 16 8l9 8v9H7z" fill="none" stroke="#F4F1EC" stroke-width="2"/><rect x="14" y="18" width="4" height="7" fill="#B5523B"/></svg><span>Ardesia<small>case e terreni</small></span></a>',
    destra: function () { return '<a class="nx-btn ico t x-badge" href="#/salvati" aria-label="Salvati">' + ic('cuore') + '<b id="a-n-pref">' + st.pref.length + '</b></a>'; },
    stili: { a: ['Classico', 'Liste raggruppate e barra delle schede, come le app di sistema.'], b: ['Editoriale', 'Foto grandi, titoli importanti e schede ampie, come una rivista di case.'], c: ['Compatto', 'Griglia fitta, filtri sempre a portata e azioni rapide in alto.'] },
    tab: [['cerca', 'Cerca', 'cerca'], ['immobili', 'Immobili', 'casa'], ['visita', 'Visita', 'cal'], ['salvati', 'Salvati', 'cuore']],
    fab: ['#/visita', 'Prenota visita', 'cal'],
    azzera: carica,
    viste: {
      cerca: { tit: 'Cerca casa', render: vCerca, dopo: dopoCerca },
      immobili: { tit: 'Immobili', render: vImmobili },
      immobile: { tit: function (id) { return (byId(id) || IMM[0]).n; }, render: vImmobile, dopo: dopoImmobile, livello: 1, tab: 'immobili', indietro: ['#/immobili', 'Immobili'] },
      visita: { tit: 'Prenota una visita', render: vVisita, dopo: dopoVisita, lascia: function () { fatto = null; } },
      salvati: { tit: 'Salvati', render: vSalvati }
    }
  });
})();
