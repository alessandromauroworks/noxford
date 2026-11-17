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
   Bolle - app dimostrativa di un autolavaggio a mano inventato.
   Prenotazioni, ordini del bar e tessera restano in questo browser.
   ===================================================================== */
(function () {
  'use strict';
  var d = document, ic = X.ic, esc = X.esc, euro = X.euro, GG = X.GG;
  var VEI = [
    ['city', 'Utilitaria', 0, '<svg viewBox="0 0 44 26" aria-hidden="true"><path d="M6 18v-5l5-6h16l6 6h4v5z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><circle cx="13" cy="19" r="3.2" fill="currentColor"/><circle cx="31" cy="19" r="3.2" fill="currentColor"/></svg>'],
    ['suv', 'SUV o berlina', 6, '<svg viewBox="0 0 44 26" aria-hidden="true"><path d="M3 19v-7l4-6h22l6 6h6v7z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><circle cx="11" cy="20" r="3.4" fill="currentColor"/><circle cx="33" cy="20" r="3.4" fill="currentColor"/></svg>'],
    ['van', 'Furgone', 12, '<svg viewBox="0 0 44 26" aria-hidden="true"><path d="M3 19V4h26l6 7h6v8z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><circle cx="11" cy="20" r="3.4" fill="currentColor"/><circle cx="33" cy="20" r="3.4" fill="currentColor"/></svg>']
  ];
  var PROG = [
    { id: 'fuori', n: 'Esterno', p: 15, min: 25, d: ['Prelavaggio con schiuma attiva', 'Lavaggio a mano con guanto', 'Cerchi e passaruota', 'Asciugatura in microfibra'] },
    { id: 'misto', n: 'Esterno e interni', p: 25, min: 45, top: 1, img: 'img/schiuma.webp', w: 1200, h: 896, alt: 'Schiuma bianca che scivola sulla carrozzeria blu di un\'auto', d: ['Tutto il lavaggio esterno', 'Aspirazione di sedili e tappetini', 'Plastiche e cruscotto', 'Vetri dentro e fuori'] },
    { id: 'completo', n: 'Completo', p: 55, min: 120, d: ['Esterno e interni', 'Sedili lavati a vapore o pelle nutrita', 'Bagagliaio e portiere', 'Cera protettiva a mano'] },
    { id: 'interni', n: 'Igienizzazione interni', p: 40, min: 60, img: 'img/interni.webp', w: 1024, h: 1024, alt: 'Mano con guanto che pulisce un sedile in pelle nera con una spazzola morbida', d: ['Vapore su sedili e moquette', 'Trattamento del climatizzatore', 'Per chi viaggia con animali o bambini'] }
  ];
  var EXTRA = [['cera', 'Cera a mano', 'Protegge la vernice per circa un mese', 10], ['cerchi', 'Cerchi lucidati', 'Pulizia profonda e protezione', 8], ['odore', 'Profumo per l\'abitacolo', 'Fragranza leggera, senza alcol', 3]];
  var BAR = [['caffe', 'Caffè', 1.2], ['cappuccino', 'Cappuccino', 1.6], ['cornetto', 'Cornetto', 1.3], ['spremuta', 'Spremuta d\'arancia', 3], ['acqua', 'Acqua 50 cl', 1]];
  var mem = X.memoria('bolle'), st, sel, tick = null;
  function carica() { st = mem.get('stato', { v: 'city', lavaggi: 6, storico: [], attiva: null, bar: {} }); sel = { p: 'misto', ex: [], slot: null, targa: '' }; }
  var salva = function () { mem.set('stato', st); };
  var prog = function (id) { return PROG.filter(function (p) { return p.id === id; })[0]; };
  var vei = function (id) { return VEI.filter(function (v) { return v[0] === id; })[0]; };
  var durata = function (m) { return m >= 60 ? (m / 60) + (m === 60 ? ' ora' : ' ore') : m + ' min'; };
  function coda() { var h = new Date().getHours(); return h < 8 || h >= 19 ? 0 : (h * 7) % 4; }
  function aperto() { var h = new Date().getHours(), g = new Date().getDay(); return g !== 0 && h >= 8 && h < 19; }
  function testoCoda() { var n = coda(), h = new Date().getHours(); return !aperto() ? 'Chiuso ora · apriamo alle 8, dal lunedì al sabato' : n ? n + ' auto in coda · circa ' + n * 15 + ' min' : 'Nessuna coda in questo momento'; }

  function segVei(cls) {
    return '<div class="nx-seg pieno b-vei ' + cls + '" role="group" aria-label="Tipo di veicolo">' + VEI.map(function (v) { return '<button type="button" data-v="' + v[0] + '" aria-pressed="' + (st.v === v[0]) + '">' + v[3] + '<span>' + v[1] + '</span></button>'; }).join('') + '</div>';
  }
  function rigaProg(p) {
    var ex = vei(st.v)[2];
    return '<li><a class="nx-cella" href="#/prenota/' + p.id + '"><span class="nx-c-tx"><b>' + esc(p.n) + (p.top ? ' <span class="nx-pill acc">Il più scelto</span>' : '') + '</b><small>circa ' + durata(p.min) + ' · ' + esc(p.d.slice(0, 2).join(', ').toLowerCase()) + '</small></span><span class="b-pr nx-num">' + euro(p.p + ex) + '</span><i class="nx-chev"></i></a></li>';
  }
  function schedaProg(p) {
    var ex = vei(st.v)[2];
    return '<li class="b-sch">' + (p.img ? '<img src="' + p.img + '" alt="' + esc(p.alt) + '" width="' + p.w + '" height="' + p.h + '" decoding="async">' : '') +
      '<div class="b-sch-tx"><div class="b-sch-r"><h3>' + esc(p.n) + '</h3><b class="nx-num">' + euro(p.p + ex) + '</b></div><small>circa ' + durata(p.min) + (p.top ? ' · il più scelto' : '') + '</small><ul>' + p.d.map(function (x) { return '<li>' + ic('ok') + esc(x) + '</li>'; }).join('') + '</ul><a class="nx-btn p pieno" href="#/prenota/' + p.id + '">Prenota questo</a></div></li>';
  }
  function tessProg(p) {
    var ex = vei(st.v)[2];
    return '<li><a class="b-tes' + (p.top ? ' top' : '') + '" href="#/prenota/' + p.id + '" data-nx-premi><b>' + esc(p.n) + '</b><small>circa ' + durata(p.min) + '</small><span class="nx-num">' + euro(p.p + ex) + '</span></a></li>';
  }
  function elencoProg() {
    var s = X.stile();
    if (s === 'b') return '<ul class="b-schede">' + PROG.map(schedaProg).join('') + '</ul>';
    if (s === 'c') return '<ul class="b-tessere">' + PROG.map(tessProg).join('') + '</ul>';
    return '<ul class="nx-lista b-lista">' + PROG.map(rigaProg).join('') + '</ul>';
  }
  function bandoAttiva() {
    if (!st.attiva) return '';
    return '<a class="x-card b-attiva" href="#/attesa"><span class="x-ico-q">' + ic('auto') + '</span><span class="nx-c-tx"><b>La tua auto è da noi</b><small>' + esc(st.attiva.prog) + ' · ' + esc(st.attiva.g) + ' ' + esc(st.attiva.ora) + '</small></span><i class="nx-chev"></i></a>';
  }

  /* ---------- viste ---------- */
  function vHome() {
    var s = X.stile();
    var codaHtml = '<p class="b-coda"><i aria-hidden="true" class="' + (aperto() ? (coda() ? '' : 'ok') : 'off') + '"></i>' + testoCoda() + '</p>';
    if (s === 'b') {
      return '<div class="b-hero"><img src="img/schiuma.webp" width="1200" height="896" alt="Schiuma bianca che scivola sulla carrozzeria blu lucida di un\'auto" fetchpriority="high" decoding="async"><div class="b-hero-tx"><p>Autolavaggio a mano</p><h1 class="b-hero-h">Prenoti l\'orario, salti la fila.</h1></div></div>' +
        codaHtml + bandoAttiva() + '<p class="b-lead">Laviamo a mano, uno alla volta. Mentre aspetti, il caffè te lo portiamo in sala.</p><a class="nx-btn p pieno b-cta" href="#/prenota">Prenota un lavaggio</a>' +
        '<div class="b-int"><img src="img/interni.webp" width="1024" height="1024" alt="Mano con guanto che pulisce un sedile in pelle nera con una spazzola morbida" decoding="async"><div><h2>Interni come nuovi</h2><p>Aspirazione, plastiche, vetri e sedili in pelle o tessuto, a vapore.</p><a class="nx-btn t" href="#/programmi">Vedi i programmi</a></div></div>' +
        '<h2 class="x-h2">Come funziona</h2><ol class="b-tre"><li><b>Scegli programma e orario</b></li><li><b>Lasci l\'auto e la chiave</b></li><li><b>Ti avvisiamo quando è pronta</b></li></ol>';
    }
    if (s === 'c') {
      return '<h1 class="nx-tit-grande x-tit">Bolle</h1>' +
        '<div class="b-cruscotto"><div class="x-card"><small>Coda adesso</small><b>' + (!aperto() ? 'chiuso' : coda() || 'nessuna') + '</b><small>' + (!aperto() ? 'apriamo alle 8' : coda() ? 'auto prima di te' : 'entri subito') + '</small></div><a class="x-card" href="#/attesa"><small>La tua auto</small><b>' + (st.attiva ? 'in lavaggio' : 'nessuna') + '</b><small>' + (st.attiva ? esc(st.attiva.prog) : 'prenota un orario') + '</small></a><a class="x-card" href="#/tessera"><small>Tessera</small><b class="nx-num">' + st.lavaggi + '/10</b><small>' + (st.lavaggi >= 10 ? 'esterno gratis' : 'al decimo, gratis') + '</small></a></div>' +
        '<h2 class="x-h2">Programmi</h2>' + segVei('b-vei-c') + elencoProg();
    }
    return '<h1 class="nx-tit-grande x-tit">Bolle</h1>' + codaHtml + bandoAttiva() +
      '<div class="x-card b-promo"><img src="img/schiuma.webp" width="1200" height="896" alt="Schiuma bianca sulla carrozzeria blu di un\'auto" decoding="async"><div class="x-pad"><h2>Prenoti l\'orario, salti la fila.</h2><p>Laviamo a mano. Mentre aspetti, il caffè te lo portiamo in sala.</p><a class="nx-btn p pieno" href="#/prenota">Prenota un lavaggio</a></div></div>' +
      '<h2 class="x-h2">Programmi</h2>' + elencoProg();
  }
  function vProgrammi() { return '<h1 class="nx-tit-grande x-tit">Programmi</h1><p class="x-lab">Il tuo veicolo</p>' + segVei('b-vei-p') + '<div class="b-spazio"></div>' + elencoProg(); }
  function slots() {
    var ora = new Date(), out = [], lim = new Date(ora.getTime() + 30 * 60000);
    for (var g = 0; out.length < 12 && g < 4; g++) for (var h = 8; h < 19 && out.length < 12; h++) for (var m = 0; m < 60 && out.length < 12; m += 30) {
      var s = new Date(ora); s.setDate(s.getDate() + g); s.setHours(h, m, 0, 0);
      if (s > lim && s.getDay() !== 0) out.push({ id: s.getDate() + '-' + h + '-' + m, ora: h + ':' + (m ? '30' : '00'), g: g === 0 ? 'oggi' : g === 1 ? 'domani' : GG[s.getDay()], t: s.getTime(), pieno: (h + m + s.getDate()) % 4 === 0 });
    }
    return out;
  }
  function conto() {
    var p = prog(sel.p), v = vei(st.v), r = [[p.n + ' · ' + v[1].toLowerCase(), p.p + v[2]]];
    sel.ex.forEach(function (x) { var e = EXTRA.filter(function (y) { return y[0] === x; })[0]; r.push([e[1], e[3]]); });
    return { r: r, tot: r.reduce(function (a, x) { return a + x[1]; }, 0) };
  }
  function contoHtml() {
    var c = conto();
    return c.r.map(function (x) { return '<p><span>' + esc(x[0]) + '</span><span>' + euro(x[1]) + '</span></p>'; }).join('') + '<p class="t"><span>Totale</span><span class="nx-num">' + euro(c.tot) + '</span></p><small>Si paga alla riconsegna, anche con carta.</small>';
  }
  function vPrenota(id) {
    if (id && prog(id)) sel.p = id;
    var ex = vei(st.v)[2], sl = slots();
    if (sel.slot && !sl.some(function (s) { return s.id === sel.slot && !s.pieno; })) sel.slot = null;
    return '<h1 class="nx-tit-grande x-tit">Prenota</h1><p class="x-lab">Veicolo</p>' + segVei('b-vei-f') +
      '<p class="x-lab">Programma</p><div class="x-scelte">' + PROG.map(function (p) { return '<label class="x-scelta"><input type="radio" name="b-prog" value="' + p.id + '"' + (sel.p === p.id ? ' checked' : '') + '><span class="x-sp">' + esc(p.n) + '<small>circa ' + durata(p.min) + '</small></span><em class="nx-num">' + euro(p.p + ex) + '</em><i></i></label>'; }).join('') + '</div>' +
      '<p class="x-lab">Extra</p><div class="x-scelte">' + EXTRA.map(function (e) { return '<label class="x-scelta"><input type="checkbox" name="b-ex" value="' + e[0] + '"' + (sel.ex.indexOf(e[0]) > -1 ? ' checked' : '') + '><span class="x-sp">' + esc(e[1]) + '<small>' + esc(e[2]) + '</small></span><em>+' + euro(e[3]) + '</em><i></i></label>'; }).join('') + '</div>' +
      '<p class="x-lab">Quando</p><div class="x-orari b-slot" role="group" aria-label="Orario">' + sl.map(function (s) { return '<button type="button" data-b-slot="' + s.id + '" data-ora="' + s.ora + '" data-g="' + s.g + '" data-t="' + s.t + '" aria-pressed="' + (sel.slot === s.id) + '"' + (s.pieno ? ' disabled aria-label="' + s.g + ' ' + s.ora + ', pieno"' : ' aria-label="' + s.g + ' alle ' + s.ora + '"') + '><small>' + s.g + '</small>' + s.ora + '</button>'; }).join('') + '</div>' +
      '<label class="nx-campo b-targa"><span>Targa <small>facoltativa, ci serve per riconoscere l\'auto</small></span><input id="b-targa" placeholder="AB123CD" maxlength="10" autocomplete="off" autocapitalize="characters" value="' + esc(sel.targa) + '"></label>' +
      '<div class="x-conto" id="b-conto" aria-live="polite">' + contoHtml() + '</div><p class="x-err" id="b-err" role="alert"></p>' +
      '<div class="x-azioni"><button type="button" class="nx-btn p" data-b="conferma" id="b-ok">' + (sel.slot ? 'Conferma il lavaggio' : 'Scegli un orario') + '</button></div><p class="x-nota">Demo: niente viene inviato. Si paga in sede, alla riconsegna.</p>';
  }
  function barHtml() {
    var tot = BAR.reduce(function (s, b) { return s + (st.bar[b[0]] || 0) * b[2]; }, 0);
    return '<ul class="nx-lista b-bar">' + BAR.map(function (b) { var n = st.bar[b[0]] || 0; return '<li><div class="nx-cella"><span class="nx-c-tx"><b>' + esc(b[1]) + '</b><small class="nx-num">' + euro(b[2], 1) + '</small></span><div class="x-step"><button type="button" data-b-bar="' + b[0] + '" data-d="-1" aria-label="Togli ' + esc(b[1]) + '"' + (n ? '' : ' disabled') + '>' + ic('meno') + '</button><b aria-live="polite">' + n + '</b><button type="button" data-b-bar="' + b[0] + '" data-d="1" aria-label="Aggiungi ' + esc(b[1]) + '">' + ic('piu') + '</button></div></div></li>'; }).join('') + '</ul>' +
      '<div class="x-azioni"><button type="button" class="nx-btn p" data-b="ordina"' + (tot ? '' : ' disabled') + '>' + (tot ? 'Portatemelo in sala · ' + euro(tot, 1) : 'Scegli cosa ordinare') + '</button></div>';
  }
  function vAttesa() {
    var a = st.attiva, box;
    if (!a) box = '<div class="x-card">' + NX.stato.vuoto('Nessuna auto da noi', 'Quando prenoti un lavaggio, qui vedi a che punto è.', ['Prenota un lavaggio', 'b-prenota']) + '</div>';
    else box = '<div class="x-card x-pad b-stato"><div class="b-st-r"><span><small>' + esc(a.prog) + ' · ' + esc(a.targa || 'la tua auto') + '</small><b><span id="b-min" class="nx-num">--</span> min</b><small>alla fine del lavaggio</small></span><span class="nx-pill info">' + esc(a.g) + ' ' + esc(a.ora) + '</span></div><div class="x-barra"><i id="b-bar" style="width:0"></i></div>' +
      '<ol class="x-fasi b-fasi" id="b-fasi"><li><b>Accettata</b><small>chiave in cassa</small></li><li><b>Schiuma e lavaggio</b><small>a mano, con guanto</small></li><li><b>Interni e vetri</b><small>aspirazione e plastiche</small></li><li><b>Pronta</b><small>ti aspetta all\'uscita</small></li></ol><button type="button" class="nx-btn t" data-b="ritirata" id="b-rit" hidden>Ho ritirato l\'auto</button></div><p class="x-nota">Simulazione: la barra avanza da sola, per mostrare cosa vede il cliente.</p>';
    return '<h1 class="nx-tit-grande x-tit">La tua auto</h1>' + box + '<h2 class="x-h2">Bar della sala d\'attesa<small>Te lo portiamo al tavolo e lo paghi con il lavaggio</small></h2><div id="b-barbox">' + barHtml() + '</div>';
  }
  function dopoAttesa() {
    clearInterval(tick); var a = st.attiva; if (!a) return;
    var f = function () {
      var k = Math.min(1, (Date.now() - a.start) / 24000), bar = d.getElementById('b-bar'); if (!bar) { clearInterval(tick); return; }
      bar.style.width = Math.round(k * 100) + '%';
      d.getElementById('b-min').textContent = Math.max(0, Math.round(a.min * (1 - k)));
      d.querySelectorAll('#b-fasi li').forEach(function (li, i) { var s = i / 3; li.className = k >= s + 0.001 || (i === 3 && k >= 1) ? 'ok' : (k >= (i - 1) / 3 ? 'ora' : ''); });
      if (k >= 1) { clearInterval(tick); d.getElementById('b-rit').hidden = false; }
    };
    f(); tick = setInterval(f, 400);
  }
  function vTessera() {
    var g = ''; for (var i = 1; i <= 10; i++) g += '<i class="' + (i <= st.lavaggi ? 'on' : '') + '">' + (i === 10 ? ic('stella') : ic('goccia')) + '</i>';
    var s = st.storico.length ? st.storico : [{ prog: 'Esterno e interni', g: '2 novembre', tot: 25 }, { prog: 'Esterno', g: '18 ottobre', tot: 15 }];
    return '<h1 class="nx-tit-grande x-tit">Tessera</h1><div class="b-tess"><small>Tessera lavaggi · Bolle</small><h2>' + (st.lavaggi >= 10 ? 'Il prossimo esterno è gratis' : st.lavaggi + ' lavaggi su 10') + '</h2><p>Al decimo lavaggio, un esterno lo offriamo noi.</p><div class="b-gocce" role="img" aria-label="' + st.lavaggi + ' timbri su 10">' + g + '</div></div>' +
      '<h2 class="x-h2">Lavaggi fatti</h2><ul class="nx-lista">' + s.map(function (x) { return '<li><div class="nx-cella"><span class="nx-c-tx"><b>' + esc(x.prog) + '</b><small>' + esc(x.g) + (x.ora ? ' alle ' + esc(x.ora) : '') + '</small></span><span class="nx-c-dx nx-num">' + euro(x.tot) + '</span></div></li>'; }).join('') + '</ul><p class="x-nota">Tessera e storico sono di esempio e restano solo in questo browser.</p>';
  }

  function aggConto() { var c = d.getElementById('b-conto'); if (c) { c.innerHTML = contoHtml(); c.classList.remove('nx-scala'); void c.offsetWidth; c.classList.add('nx-scala'); } }
  function dopoSegVei(box) {
    var s = box.querySelector('.b-vei'); if (!s) return;
    NX.seg(s, function (v) { st.v = v; salva(); X.ridisegna(); });
  }
  d.addEventListener('change', function (e) {
    var t = e.target;
    if (t.name === 'b-prog') { sel.p = t.value; aggConto(); }
    else if (t.name === 'b-ex') { sel.ex = Array.prototype.map.call(d.querySelectorAll('input[name=b-ex]:checked'), function (i) { return i.value; }); aggConto(); }
  });
  d.addEventListener('input', function (e) { if (e.target.id === 'b-targa') { sel.targa = e.target.value; d.getElementById('b-err').textContent = ''; } });
  d.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var a = b.getAttribute('data-b');
    if (b.hasAttribute('data-b-slot')) {
      sel.slot = b.getAttribute('data-b-slot'); sel.ora = b.getAttribute('data-ora'); sel.g = b.getAttribute('data-g'); sel.t = +b.getAttribute('data-t');
      d.querySelectorAll('[data-b-slot]').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
      d.getElementById('b-ok').textContent = 'Conferma il lavaggio';
    }
    else if (b.hasAttribute('data-b-bar')) {
      var k = b.getAttribute('data-b-bar'); st.bar[k] = Math.max(0, (st.bar[k] || 0) + +b.getAttribute('data-d')); salva();
      var box = d.getElementById('b-barbox'); box.innerHTML = barHtml();
      var n = box.querySelector('[data-b-bar="' + k + '"][data-d="' + b.getAttribute('data-d') + '"]'); if (n) { n.focus({ preventScroll: true }); var num = n.parentNode.querySelector('b'); num.classList.add('nx-scala'); }
    }
    else if (b.getAttribute('data-nx-azione') === 'b-prenota') X.vai('#/prenota');
    else if (a === 'ordina') {
      var q = BAR.filter(function (x) { return st.bar[x[0]]; }).map(function (x) { return st.bar[x[0]] + ' ' + x[1].toLowerCase(); }).join(', ');
      st.bar = {}; salva(); d.getElementById('b-barbox').innerHTML = barHtml(); NX.toast('Ordinato: ' + q + '. Arriva al tuo tavolo.');
    }
    else if (a === 'ritirata') { st.attiva = null; salva(); X.ridisegna(); NX.toast('Grazie, a presto.'); }
    else if (a === 'conferma') {
      var tg = (sel.targa || '').trim().toUpperCase().replace(/\s/g, ''), err = d.getElementById('b-err');
      if (!sel.slot) { err.textContent = 'Scegli un orario libero.'; return; }
      if (tg && !/^[A-Z]{2}\d{3}[A-Z]{2}$/.test(tg)) { err.textContent = 'La targa va scritta come AB123CD, oppure lasciala vuota.'; d.getElementById('b-targa').focus(); return; }
      var c = conto(), p = prog(sel.p);
      st.attiva = { prog: p.n, targa: tg, ora: sel.ora, g: sel.g, min: p.min, start: Date.now() };
      st.storico.unshift({ prog: p.n, g: sel.g, ora: sel.ora, tot: c.tot }); st.lavaggi = Math.min(10, st.lavaggi + 1);
      sel.slot = null; sel.targa = ''; salva(); X.vai('#/attesa'); NX.toast('Prenotato per ' + st.attiva.g + ' alle ' + st.attiva.ora + '. Un timbro in più sulla tessera.');
    }
  });

  carica();
  X.avvia({
    chiave: 'bolle', mem: mem, nome: 'Bolle autolavaggio', home: 'home',
    striscia: 'App dimostrativa di un\'attività inventata · Programmi, prezzi e attese sono di esempio · Foto generate con l\'IA',
    marchio: '<a class="x-marchio" href="#/home" aria-label="Bolle, torna alla home"><svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" fill="#0A82AE"/><circle cx="12.5" cy="14" r="6" fill="none" stroke="#fff" stroke-width="2.2"/><circle cx="21.5" cy="20.5" r="4" fill="none" stroke="#FFD23F" stroke-width="2.2"/></svg><span>Bolle<small>autolavaggio a mano</small></span></a>',
    destra: function () { return st.attiva ? '<a class="nx-btn ico t x-badge" href="#/attesa" aria-label="La tua auto è in lavaggio">' + ic('auto') + '<b>1</b></a>' : ''; },
    stili: { a: ['Classico', 'Liste raggruppate e barra delle schede, come le app di sistema.'], b: ['Editoriale', 'Foto grandi e programmi raccontati in schede ampie.'], c: ['Compatto', 'Cruscotto con coda, auto e tessera, programmi in griglia.'] },
    tab: [['home', 'Home', 'casa'], ['programmi', 'Programmi', 'bolle'], ['prenota', 'Prenota', 'cal'], ['attesa', 'Attesa', 'tazza'], ['tessera', 'Tessera', 'carta']],
    fab: ['#/prenota', 'Prenota', 'cal'],
    azzera: function () { clearInterval(tick); carica(); },
    viste: {
      home: { tit: 'Bolle', render: vHome, dopo: dopoSegVei },
      programmi: { tit: 'Programmi', render: vProgrammi, dopo: dopoSegVei },
      prenota: { tit: 'Prenota', render: vPrenota, dopo: dopoSegVei },
      attesa: { tit: 'La tua auto', render: vAttesa, dopo: dopoAttesa, lascia: function () { clearInterval(tick); } },
      tessera: { tit: 'Tessera', render: vTessera }
    }
  });
})();
