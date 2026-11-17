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
   Libeccio - app dimostrativa di un noleggio barche inventato.
   Prenotazioni in questo browser, meteo di esempio.
   ===================================================================== */
(function () {
  'use strict';
  var d = document, ic = X.ic, esc = X.esc, euro = X.euro, GG = X.GG, GGL = X.GGL, MM = X.MM, giorno = X.giorno;
  var B = [
    { id: 'gozzo', t: 'motore', n: 'Gozzo Marinella', br: 'Marinella', m: 5.8, cv: 40, posti: 6, pat: 0, sk: 0, p: 180, desc: 'Il gozzo in legno per girare le cale vicine al porto. Si guida in un attimo, anche la prima volta.', inc: ['Tendalino parasole', 'Scaletta da bagno', 'Ancora e cima', 'Spiegazione di 20 minuti prima di partire'], col: '#C9773D' },
    { id: 'scirocco', t: 'gommone', n: 'Gommone Scirocco', br: 'Scirocco', m: 6.5, cv: 40, posti: 8, pat: 0, sk: 1, p: 240, img: 'img/gommone.webp', w: 1000, h: 747, alt: 'Gommone bianco all\'ancora in una caletta turchese tra scogli bianchi e pini', desc: 'Veloce il giusto e stabile: perfetto per le famiglie. Non serve la patente nautica.', inc: ['Prendisole a prua', 'Doccetta d\'acqua dolce', 'Frigo portatile', 'Kit di sicurezza e radio'] },
    { id: 'grecale', t: 'motore', n: 'Open Grecale 7', br: 'Grecale', m: 7.2, cv: 150, posti: 8, pat: 1, sk: 1, p: 390, img: 'img/motore.webp', w: 1200, h: 896, alt: 'Barca a motore bianca con tendalino blu ormeggiata a un molo di pietra davanti a case colorate', desc: 'Per arrivare lontano in poco tempo: isole e grotte in giornata. Serve la patente nautica, altrimenti viene uno skipper.', inc: ['Tendalino blu', 'Ecoscandaglio e GPS', 'Doccetta', 'Tavolino a poppa'] },
    { id: 'maestrale', t: 'vela', n: 'Barca a vela Maestrale', br: 'Maestrale', m: 12, cv: 30, posti: 8, pat: 1, sk: 1, p: 520, img: 'img/vela.webp', w: 1200, h: 896, alt: 'Barca a vela bianca con le vele alzate su mare blu davanti a una costa di roccia', desc: 'Dodici metri, due cabine e una cucina: si esce la mattina e si rientra al tramonto, o si dorme in rada.', inc: ['Due cabine doppie', 'Cucina e frigo', 'Tender per scendere a terra', 'Teli mare per tutti'] },
    { id: 'tramontana', t: 'vela', n: 'Catamarano Tramontana', br: 'Tramontana', m: 13.5, cv: 60, posti: 10, pat: 1, sk: 2, p: 890, desc: 'Ampio e stabile, con la rete a prua per stendersi. Solo con skipper, il pranzo a bordo è compreso.', inc: ['Skipper sempre compreso', 'Pranzo a bordo', 'Maschere e boccagli', 'Tavola SUP'], col: '#2B6A94' }
  ];
  var TIPI = [['tutte', 'Tutte'], ['gommone', 'Gommoni'], ['motore', 'A motore'], ['vela', 'A vela']];
  var EXTRA = [['carb', 'Pieno di carburante', 'Paghi solo quello che usi, al rientro', 0], ['snork', 'Maschere e pinne', 'Per 6 persone', 25], ['sup', 'Tavola SUP', 'Con pagaia e giubbotto', 40], ['pranzo', 'Pranzo a bordo', 'Pane, frutta, insalata di riso, acqua', 18, 1], ['ghiaccio', 'Ghiaccio e bibite', 'Nel frigo all\'imbarco', 30]];
  var DUR = [['mattina', 'Mezza giornata, mattina', '9:00–13:00', 0.6], ['pome', 'Mezza giornata, pomeriggio', '14:00–19:00', 0.6], ['giorno', 'Giornata intera', '9:00–19:00', 1]];
  var SKIPPER = 150;
  var DIR = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
  var NOMI = { N: 'Tramontana', NE: 'Grecale', E: 'Levante', SE: 'Scirocco', S: 'Ostro', SO: 'Libeccio', O: 'Ponente', NO: 'Maestrale' };
  var mem = X.memoria('libeccio'), st, sel, fatto = null;
  function carica() { st = mem.get('stato', { pren: [] }); sel = { g: 1, pers: 4, sk: 'tutti', tipo: 'tutte', pat: false, barca: 'scirocco', dur: 'giorno', extra: { carb: 1 } }; fatto = null; }
  var byId = function (id) { return B.filter(function (b) { return b.id === id; })[0]; };
  /* meteo di esempio, sempre uguale per lo stesso giorno */
  function meteo(k) {
    var g = giorno(k).getDate(), v = 5 + (g * 7) % 17, dir = DIR[(g * 3) % 8];
    return { v: v, dir: dir, nome: NOMI[dir], mare: v < 9 ? 'calmo' : v < 14 ? 'poco mosso' : v < 19 ? 'mosso' : 'molto mosso', onda: (v / 22).toFixed(1).replace('.', ','), sole: v < 15, t: 18 + (g % 6), ore: [0, 1, 2, 3, 4].map(function (h) { return Math.max(3, v - 3 + ((g + h * 5) % 7)); }) };
  }
  function iconaMeteo(m) {
    return m.sole ? '<svg class="l-met" viewBox="0 0 60 60" aria-hidden="true"><circle cx="30" cy="26" r="11" fill="#F2B632"/><g stroke="#F2B632" stroke-width="3" stroke-linecap="round"><path d="M30 6v5M30 41v5M10 26h5M45 26h5M16 12l3 3M41 37l3 3M44 12l-3 3M19 37l-3 3"/></g><path d="M8 52c6 4 12 4 18 0s12-4 18 0 10 3 12 2" fill="none" stroke="#5FA3CF" stroke-width="3"/></svg>'
      : '<svg class="l-met" viewBox="0 0 60 60" aria-hidden="true"><path d="M16 36h28a9 9 0 0 0 0-18 13 13 0 0 0-25-2 8 8 0 0 0-3 20z" fill="#B9C9D8"/><path d="M6 46h34M14 53h38" stroke="#D9533B" stroke-width="3" stroke-linecap="round"/></svg>';
  }
  function disegno(b) {
    return '<svg class="l-ill" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Disegno della barca ' + esc(b.n) + '"><rect width="320" height="180" fill="#CFE2EE"/><path d="M0 120c40-8 80 8 120 0s80-8 120 0 60 6 80 2v58H0z" fill="#2B6A94"/>' +
      (b.t === 'vela' ? '<path d="M150 30v80H95zM158 40l45 70h-45z" fill="#FBF8F2"/><path d="M80 112h180l-25 22H100z" fill="#FBF8F2"/><path d="M60 118h70l-10 14H72zM190 118h70l-10 14h-50z" fill="' + b.col + '" opacity=".7"/>' : '<path d="M70 104h170l-22 26H95z" fill="' + b.col + '"/><path d="M110 104v-16h60l14 16z" fill="#FBF8F2"/><path d="M100 104h130" stroke="#FBF8F2" stroke-width="3"/>') + '</svg>';
  }
  function foto(b, cls) { return b.img ? '<img class="' + cls + '" src="' + b.img + '" alt="' + esc(b.alt) + '" width="' + b.w + '" height="' + b.h + '" decoding="async">' : '<span class="' + cls + ' l-svg">' + disegno(b) + '</span>'; }
  function filtrate() { return B.filter(function (b) { return (sel.tipo === 'tutte' || b.t === sel.tipo) && (!sel.pat || !b.pat) && b.posti >= sel.pers && (sel.sk !== 'no' || b.sk < 2) && (sel.sk !== 'si' || b.sk >= 1); }); }
  function dataLunga(k) { var g = giorno(k); return GGL[g.getDay()] + ' ' + g.getDate() + ' ' + MM[g.getMonth()]; }
  function giorniHtml(attr, n) {
    var h = '';
    for (var k = 1; k <= (n || 10); k++) { var g = giorno(k), m = meteo(k); h += '<button type="button" ' + attr + '="' + k + '" aria-pressed="' + (k === sel.g) + '" aria-label="' + dataLunga(k) + ', vento ' + m.v + ' nodi"><small>' + (k === 1 ? 'domani' : GG[g.getDay()]) + '</small><b>' + g.getDate() + '</b><i class="l-vento' + (m.v >= 19 ? ' forte' : '') + '">' + m.v + ' kn</i></button>'; }
    return h;
  }
  function segSk(cls, val, voci) { return '<div class="nx-seg pieno ' + cls + '" role="group" aria-label="Skipper">' + voci.map(function (v) { return '<button type="button" data-v="' + v[0] + '" aria-pressed="' + (v[0] === val) + '">' + v[1] + '</button>'; }).join('') + '</div>'; }

  /* tre modi di mostrare una barca */
  function metri(b) { return String(b.m).replace('.', ','); }
  function info(b) { return metri(b) + ' m · ' + b.posti + ' posti · ' + (b.pat ? 'patente' : 'senza patente') + (b.sk === 2 ? ' · con skipper' : ''); }
  function riga(b) { return '<li><a class="nx-cella" href="#/barca/' + b.id + '">' + foto(b, 'x-thumb') + '<span class="nx-c-tx"><b>' + esc(b.n) + '</b><small>' + info(b) + '</small><span class="l-pr nx-num">da ' + euro(b.p) + ' <small>al giorno</small></span></span><i class="nx-chev"></i></a></li>'; }
  function scheda(b) {
    return '<li class="l-sch"><a href="#/barca/' + b.id + '">' + foto(b, 'l-sch-f') + '<span class="l-sch-tx"><span class="l-sch-k">' + (b.t === 'vela' ? 'A vela' : b.t === 'gommone' ? 'Gommone' : 'A motore') + ' · ' + metri(b) + ' metri</span><b>' + esc(b.n) + '</b><small>' + esc(b.desc) + '</small><span class="l-sch-p nx-num">da ' + euro(b.p) + ' <small>al giorno</small></span></span></a></li>';
  }
  function tess(b) { return '<li><a class="l-tes" href="#/barca/' + b.id + '" data-nx-premi>' + foto(b, 'l-tes-f') + '<span class="l-tes-tx"><b>' + esc(b.br) + '</b><small>' + b.posti + ' posti · ' + (b.pat ? 'patente' : 'libera') + '</small><span class="nx-num">' + euro(b.p) + '</span></span></a></li>'; }
  function elenco(l) {
    var s = X.stile();
    if (!l.length) return '<div class="x-card">' + NX.stato.vuoto('Nessuna barca', 'Con questi filtri non c\'è niente. Prova con meno persone o togli "senza patente".', ['Togli i filtri', 'l-reset']) + '</div>';
    if (s === 'b') return '<ul class="l-schede">' + l.map(scheda).join('') + '</ul>';
    if (s === 'c') return '<ul class="l-tessere">' + l.map(tess).join('') + '</ul>';
    return '<ul class="nx-lista l-lista">' + l.map(riga).join('') + '</ul>';
  }
  function meteoMini() {
    var m = meteo(sel.g);
    return '<a class="x-card l-mm" href="#/meteo">' + iconaMeteo(m) + '<span class="nx-c-tx"><b>' + dataLunga(sel.g) + ': ' + m.nome.toLowerCase() + ' ' + m.v + ' nodi</b><small>Mare ' + m.mare + ', ' + m.t + '° · previsioni di esempio</small></span><i class="nx-chev"></i></a>';
  }
  function vaiTesto() { var n = filtrate().length; return n ? 'Vedi ' + n + (n === 1 ? ' barca libera' : ' barche libere') : 'Nessuna barca: cambia i filtri'; }
  function cerca() {
    return '<div class="l-cerca"><p class="x-lab">Quando</p><div class="x-giorni" role="group" aria-label="Giorno">' + giorniHtml('data-l-g') + '</div>' +
      '<div class="l-riga"><div><p class="x-lab">Persone</p><div class="x-step"><button type="button" data-l-pers="-1" aria-label="Una persona in meno">' + ic('meno') + '</button><b id="l-pers" aria-live="polite">' + sel.pers + '</b><button type="button" data-l-pers="1" aria-label="Una persona in più">' + ic('piu') + '</button></div></div>' +
      '<div class="l-sk"><p class="x-lab">Skipper</p>' + segSk('l-seg-sk', sel.sk, [['tutti', 'Indifferente'], ['no', 'Guido io'], ['si', 'Con skipper']]) + '</div></div>' +
      '<a class="nx-btn p pieno l-vai" href="#/flotta">' + vaiTesto() + '</a></div>';
  }

  /* ---------- viste ---------- */
  function vHome() {
    var s = X.stile();
    var mie = st.pren.length ? '<a class="x-card l-mia" href="#/prenota"><span class="x-ico-q">' + ic('doc') + '</span><span class="nx-c-tx"><b>' + esc(st.pren[0].n) + '</b><small>' + esc(st.pren[0].g) + ' · codice ' + esc(st.pren[0].cod) + '</small></span><i class="nx-chev"></i></a>' : '';
    if (s === 'b') {
      return '<div class="l-hero"><img src="img/vela.webp" width="1200" height="896" alt="Barca a vela bianca con le vele alzate su mare blu davanti a una costa di roccia" fetchpriority="high" decoding="async"><div class="l-hero-tx"><p>Porto di Cala Ventosa</p><h1 class="l-hero-h">Una giornata in mare, <em>scegli tu come.</em></h1></div></div>' +
        mie + cerca() + meteoMini() + '<h2 class="x-h2">La flotta<small>Cinque barche, dal gozzo al catamarano</small></h2>' + elenco(B.slice(1, 4));
    }
    if (s === 'c') {
      return '<h1 class="nx-tit-grande x-tit">Libeccio</h1>' + mie + meteoMini() + cerca() + '<h2 class="x-h2">Barche</h2>' + elenco(B);
    }
    return '<h1 class="nx-tit-grande x-tit">Esci in mare</h1>' + mie + cerca() + '<h2 class="x-h2">Mare e vento</h2>' + meteoMini();
  }
  function vFlotta() {
    var l = filtrate();
    return '<h1 class="nx-tit-grande x-tit">La flotta</h1><div class="nx-chips l-chips" role="group" aria-label="Tipo di barca">' + TIPI.map(function (t) { return '<button type="button" class="nx-chip" data-l-tipo="' + t[0] + '" aria-pressed="' + (t[0] === sel.tipo) + '">' + t[1] + '</button>'; }).join('') + '</div>' +
      '<ul class="nx-lista l-filtri"><li><label class="nx-cella nx-toggle x-tg"><span>Solo senza patente</span><input type="checkbox" id="l-pat"' + (sel.pat ? ' checked' : '') + '><i></i></label></li></ul>' +
      '<p class="l-conta" aria-live="polite">' + l.length + (l.length === 1 ? ' barca' : ' barche') + ' per ' + sel.pers + ' persone, ' + dataLunga(sel.g) + (sel.sk === 'si' ? ', con skipper' : sel.sk === 'no' ? ', guidate da voi' : '') + '</p>' + elenco(l);
  }
  function vBarca(id) {
    var b = byId(id) || B[1];
    var conSk = b.sk === 2 || (b.sk === 1 && sel.sk === 'si');
    return '<div class="l-b-f">' + foto(b, 'l-b-img') + '</div><p class="l-k">' + (b.t === 'vela' ? 'A vela' : b.t === 'gommone' ? 'Gommone' : 'A motore') + ' · porto di Cala Ventosa</p><h1 class="nx-tit-grande x-tit l-b-t">' + esc(b.n) + '</h1><p class="l-desc">' + esc(b.desc) + '</p>' +
      '<div class="x-dati"><div><b>' + String(b.m).replace('.', ',') + '</b><small>metri</small></div><div><b>' + b.posti + '</b><small>persone</small></div><div><b>' + b.cv + '</b><small>cavalli</small></div><div><b>' + (b.pat ? 'Sì' : 'No') + '</b><small>patente</small></div></div>' +
      '<h2 class="x-h2">Compreso nel prezzo</h2><ul class="x-kv l-inc">' + b.inc.map(function (i) { return '<li><span>' + ic('ok') + esc(i) + '</span></li>'; }).join('') + '</ul>' +
      '<h2 class="x-h2">Skipper</h2>' + (b.sk === 0 ? '<p class="x-avviso info">' + ic('info') + '<span>Su questa barca guidi tu: nessuna patente, ti spieghiamo tutto prima di partire.</span></p>'
        : b.sk === 2 ? '<p class="x-avviso info">' + ic('info') + '<span>Su questa barca lo skipper è sempre a bordo, compreso nel prezzo.</span></p>'
        : segSk('l-seg-bsk', conSk ? 'si' : 'no', [['no', 'Guido io'], ['si', 'Con skipper']]) + '<p class="x-nota" id="l-sk-n">' + (conSk ? 'Lo skipper conosce le cale e prepara il pranzo: ' + euro(SKIPPER) + ' al giorno in più.' : b.pat ? 'Per guidarla serve la patente nautica: la chiediamo all\'imbarco.' : 'Nessuna patente: ti spieghiamo tutto prima di partire.') + '</p>') +
      '<div class="x-card x-pad l-prezzo"><span><b class="nx-num" id="l-b-pr">' + euro(b.p + (b.sk === 1 && conSk ? SKIPPER : 0)) + '</b><small> al giorno</small></span><a class="nx-btn p" href="#/prenota/' + b.id + '">Scegli la data</a></div>';
  }
  function conto() {
    var b = byId(sel.barca), du = DUR.filter(function (x) { return x[0] === sel.dur; })[0], skip = b.sk === 1 && sel.sk === 'si' ? SKIPPER * du[3] : 0;
    var ex = EXTRA.reduce(function (s, e) { return s + (sel.extra[e[0]] ? (e[4] ? e[3] * sel.pers : e[3]) : 0); }, 0);
    var tot = b.p * du[3] + skip + ex;
    return { b: b, d: du, skip: skip, ex: ex, tot: tot, cap: Math.round(tot * 0.3) };
  }
  function contoHtml() {
    var c = conto();
    return '<p><span>' + esc(c.b.n) + ' · ' + c.d[1].toLowerCase() + '</span><span>' + euro(c.b.p * c.d[3]) + '</span></p>' + (c.skip ? '<p><span>Skipper</span><span>' + euro(c.skip) + '</span></p>' : '') + (c.ex ? '<p><span>Extra</span><span>' + euro(c.ex) + '</span></p>' : '') +
      '<p class="t"><span>Totale</span><span class="nx-num">' + euro(c.tot) + '</span></p><small>Caparra per bloccare la data: <b>' + euro(c.cap) + '</b>. Il resto all\'imbarco' + (sel.extra.carb ? ', carburante a parte' : '') + '.</small>';
  }
  function vPrenota(id) {
    if (id && byId(id)) sel.barca = id;
    if (fatto) {
      var p = st.pren[0];
      return '<h1 class="nx-tit-grande x-tit">Data bloccata</h1><div class="x-card x-fatto nx-scala"><span class="x-spunta">' + ic('ok') + '</span><h2>' + esc(p.n) + '</h2><p>' + esc(p.g) + ' · ' + esc(p.d) + '</p><p>Totale ' + esc(p.tot) + ', caparra ' + esc(p.cap) + '</p><span class="x-codice">' + esc(p.cod) + '</span><p>Mostra il codice al pontile 3, mezz\'ora prima della partenza. Porta crema solare e un documento.</p></div>' +
        '<div class="x-azioni"><button type="button" class="nx-btn p" data-l="ics">' + ic('cal') + 'Aggiungi al calendario</button><button type="button" class="nx-btn" data-l="nuova">Prenota un\'altra uscita</button></div>' + mie();
    }
    var b = byId(sel.barca), m = meteo(sel.g);
    return '<h1 class="nx-tit-grande x-tit">Prenota</h1>' +
      '<p class="x-lab">Barca</p><div class="nx-chips l-chips" role="group" aria-label="Barca">' + B.map(function (x) { return '<button type="button" class="nx-chip" data-l-pb="' + x.id + '" aria-pressed="' + (x.id === b.id) + '">' + esc(x.br) + '</button>'; }).join('') + '</div>' +
      '<div class="x-card l-mini">' + foto(b, 'l-mini-f') + '<span><b>' + esc(b.n) + '</b><small>' + info(b) + '</small></span></div>' +
      '<p class="x-lab">Giorno</p><div class="x-giorni" role="group" aria-label="Giorno">' + giorniHtml('data-l-pg') + '</div>' +
      (m.v >= 19 ? '<div class="x-avviso">' + ic('vento') + '<span>Il ' + giorno(sel.g).getDate() + ' è previsto ' + m.nome.toLowerCase() + ' a ' + m.v + ' nodi. Se il mare non permette di uscire spostiamo la data o ti ridiamo la caparra.</span></div>' : '') +
      '<p class="x-lab">Durata</p><div class="x-scelte">' + DUR.map(function (x) { return '<label class="x-scelta"><input type="radio" name="l-dur" value="' + x[0] + '"' + (x[0] === sel.dur ? ' checked' : '') + '><span class="x-sp">' + x[1] + '<small>' + x[2] + '</small></span><em class="nx-num">' + euro(b.p * x[3]) + '</em><i></i></label>'; }).join('') + '</div>' +
      (b.sk === 1 ? '<p class="x-lab">Skipper</p>' + segSk('l-seg-psk', sel.sk === 'si' ? 'si' : 'no', [['no', 'Guido io'], ['si', 'Con skipper +' + SKIPPER + ' €']]) : '') +
      (b.pat && b.sk === 1 && sel.sk !== 'si' ? '<div class="x-avviso info" id="l-pat-av">' + ic('doc') + '<span>Hai scelto di guidare tu: all\'imbarco ti chiediamo la patente nautica.</span></div>' : '') +
      '<p class="x-lab">Extra</p><div class="x-scelte">' + EXTRA.map(function (e) { return '<label class="x-scelta"><input type="checkbox" name="l-ex" value="' + e[0] + '"' + (sel.extra[e[0]] ? ' checked' : '') + '><span class="x-sp">' + e[1] + '<small>' + e[2] + '</small></span><em>' + (e[3] ? (e[4] ? e[3] + ' € a testa' : '+' + e[3] + ' €') : 'a consumo') + '</em><i></i></label>'; }).join('') + '</div>' +
      '<div class="x-conto" id="l-conto" aria-live="polite">' + contoHtml() + '</div>' +
      '<div class="x-azioni"><button type="button" class="nx-btn p" data-l="blocca">Blocca la data</button></div><p class="x-nota">Demo: nessun pagamento e nessun dato inviato. Nella versione vera la caparra si paga con carta.</p>' + mie();
  }
  function mie() {
    if (!st.pren.length) return '';
    return '<h2 class="x-h2">Le tue uscite</h2><ul class="nx-lista">' + st.pren.map(function (p, k) { return '<li><div class="nx-cella"><span class="nx-c-tx"><b>' + esc(p.n) + '</b><small>' + esc(p.g) + ' · codice ' + esc(p.cod) + '</small></span><button type="button" class="nx-btn t r" data-l-annulla="' + k + '">Annulla</button></div></li>'; }).join('') + '</ul>';
  }
  function vMeteo() {
    var g = '', k2 = Math.min(sel.g, 7), m2 = meteo(k2), mx = Math.max.apply(null, m2.ore);
    for (var k = 1; k <= 7; k++) { var m = meteo(k), dd = giorno(k); g += '<button type="button" data-l-mg="' + k + '" aria-pressed="' + (k === k2) + '" aria-label="' + dataLunga(k) + ', ' + m.v + ' nodi"' + (m.v >= 19 ? ' class="forte"' : '') + '><small>' + GG[dd.getDay()] + '</small>' + iconaMeteo(m) + '<b>' + m.v + '</b></button>'; }
    var cons = m2.v < 9 ? 'Giornata da cale lontane: qualsiasi barca va bene.' : m2.v < 14 ? 'Si esce tranquilli. Con la vela si va benissimo.' : m2.v < 19 ? 'Meglio restare nelle cale riparate a est. Gommoni e gozzi solo la mattina.' : 'Vento forte: escono solo vela e catamarano con skipper. Ti proponiamo un altro giorno.';
    return '<h1 class="nx-tit-grande x-tit">Mare e vento</h1><p class="x-sub">Previsioni di esempio per il porto di Cala Ventosa. Nella versione vera arrivano da un servizio meteo marino.</p>' +
      '<div class="l-mg" role="group" aria-label="Scegli il giorno">' + g + '</div>' +
      '<div class="x-card x-pad l-big">' + iconaMeteo(m2) + '<span><small>' + dataLunga(k2) + '</small><b class="nx-num">' + m2.v + ' nodi</b><small>' + m2.nome + ' da ' + m2.dir + ' · mare ' + m2.mare + ', onda ' + m2.onda + ' m · ' + m2.t + '°</small></span></div>' +
      '<h2 class="x-h2">Durante la giornata</h2><div class="x-card x-pad l-ore">' + ['9', '11', '13', '15', '17'].map(function (h, i) { return '<div><span>' + h + ':00</span><i style="width:' + Math.round(m2.ore[i] / mx * 100) + '%"></i><b class="nx-num">' + m2.ore[i] + ' kn</b></div>'; }).join('') + '</div>' +
      '<div class="x-avviso info">' + ic('info') + '<span><b>Il consiglio del porto.</b> ' + cons + '</span></div>' +
      '<div class="x-azioni"><a class="nx-btn p" href="#/flotta">Vedi le barche per questo giorno</a></div>';
  }

  function aggCerca() { var a = d.querySelector('.l-vai'); if (a) a.textContent = vaiTesto(); }
  function aggConto() { var c = d.getElementById('l-conto'); if (c) { c.innerHTML = contoHtml(); c.classList.remove('nx-scala'); void c.offsetWidth; c.classList.add('nx-scala'); } }
  function dopo(box) {
    var s = box.querySelector('.l-seg-sk'); if (s) NX.seg(s, function (v) { sel.sk = v; aggCerca(); });
    var bs = box.querySelector('.l-seg-bsk'); if (bs) NX.seg(bs, function (v) { sel.sk = v; X.ridisegna(); });
    var ps = box.querySelector('.l-seg-psk'); if (ps) NX.seg(ps, function (v) { sel.sk = v; X.ridisegna(); });
    var pg = box.querySelector('.x-giorni [aria-pressed="true"]'); if (pg && pg.offsetLeft > 200) pg.parentNode.scrollLeft = pg.offsetLeft - 60;
  }
  d.addEventListener('change', function (e) {
    var t = e.target;
    if (t.id === 'l-pat') { sel.pat = t.checked; X.ridisegna(); }
    else if (t.name === 'l-dur') { sel.dur = t.value; aggConto(); }
    else if (t.name === 'l-ex') { sel.extra[t.value] = t.checked; aggConto(); }
  });
  d.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b || b.disabled) return;
    var a = b.getAttribute('data-l');
    if (b.hasAttribute('data-l-g')) { sel.g = +b.getAttribute('data-l-g'); X.ridisegna(); }
    else if (b.hasAttribute('data-l-pg')) { sel.g = +b.getAttribute('data-l-pg'); X.ridisegna(); }
    else if (b.hasAttribute('data-l-mg')) { sel.g = +b.getAttribute('data-l-mg'); X.ridisegna(); }
    else if (b.hasAttribute('data-l-pers')) { sel.pers = Math.max(1, Math.min(10, sel.pers + +b.getAttribute('data-l-pers'))); d.getElementById('l-pers').textContent = sel.pers; aggCerca(); }
    else if (b.hasAttribute('data-l-tipo')) { sel.tipo = b.getAttribute('data-l-tipo'); X.ridisegna(); }
    else if (b.hasAttribute('data-l-pb')) { sel.barca = b.getAttribute('data-l-pb'); X.ridisegna(); }
    else if (b.getAttribute('data-nx-azione') === 'l-reset') { sel.tipo = 'tutte'; sel.pat = false; sel.pers = Math.min(sel.pers, 4); sel.sk = 'tutti'; X.ridisegna(); }
    else if (b.hasAttribute('data-l-annulla')) { var p = st.pren.splice(+b.getAttribute('data-l-annulla'), 1)[0]; mem.set('stato', st); if (!st.pren.length) fatto = null; X.ridisegna(); NX.toast('Uscita del ' + p.g + ' annullata. Caparra restituita.'); }
    else if (a === 'blocca') {
      var c = conto(), g = giorno(sel.g);
      st.pren.unshift({ n: c.b.n, g: GGL[g.getDay()] + ' ' + g.getDate() + ' ' + MM[g.getMonth()], gk: sel.g, t: g.getTime(), dur: c.d[0], d: c.d[1].toLowerCase() + ', ' + c.d[2], tot: euro(c.tot), cap: euro(c.cap), cod: 'LB-' + (g.getDate() * 37 + Math.round(c.b.m * 10)).toString(36).toUpperCase().slice(0, 4) });
      mem.set('stato', st); fatto = true; X.ridisegna(); window.scrollTo(0, 0);
    }
    else if (a === 'ics') {
      var p0 = st.pren[0], s = new Date(p0.t); s.setHours(p0.dur === 'pome' ? 14 : 9, 0, 0, 0);
      X.calendario('uscita-libeccio.ics', 'Uscita in barca: ' + p0.n, s, p0.dur === 'giorno' ? 600 : p0.dur === 'pome' ? 300 : 240, 'Porto di Cala Ventosa, pontile 3', 'Codice ' + p0.cod + ' (demo). Arriva mezz\'ora prima.');
      NX.toast('Promemoria creato: aprilo per aggiungerlo al calendario.');
    }
    else if (a === 'nuova') { fatto = null; X.ridisegna(); window.scrollTo(0, 0); }
  });

  carica();
  X.avvia({
    chiave: 'libeccio', mem: mem, nome: 'Libeccio barche', home: 'home',
    striscia: 'App dimostrativa di un\'attività inventata · Barche, prezzi e meteo sono di esempio · Foto generate con l\'IA',
    marchio: '<a class="x-marchio" href="#/home" aria-label="Libeccio, torna alla home"><svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" fill="#12324F"/><path d="M16 6v15H8zM18 10l6 11h-6z" fill="#F3EBDD"/><path d="M6 23h20l-3 3H9z" fill="#F0644A"/></svg><span>Libeccio<small>barche a noleggio</small></span></a>',
    stili: { a: ['Classico', 'Liste raggruppate e barra delle schede, come le app di sistema.'], b: ['Editoriale', 'Foto grandi di mare e barche, titoli da rivista di viaggio.'], c: ['Compatto', 'Meteo e filtri in alto, flotta in griglia, prenota sempre in vista.'] },
    tab: [['home', 'Home', 'casa'], ['flotta', 'Flotta', 'barca'], ['prenota', 'Prenota', 'cal'], ['meteo', 'Meteo', 'vento']],
    fab: ['#/prenota', 'Prenota', 'cal'],
    azzera: carica,
    viste: {
      home: { tit: 'Libeccio', render: vHome, dopo: dopo },
      flotta: { tit: 'La flotta', render: vFlotta, dopo: dopo },
      barca: { tit: function (id) { return (byId(id) || B[1]).n; }, render: vBarca, dopo: dopo, livello: 1, tab: 'flotta', indietro: ['#/flotta', 'Flotta'] },
      prenota: { tit: 'Prenota', render: vPrenota, dopo: dopo, lascia: function () { fatto = null; } },
      meteo: { tit: 'Mare e vento', render: vMeteo }
    }
  });
})();
