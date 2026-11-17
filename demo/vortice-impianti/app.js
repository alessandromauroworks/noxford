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
   Vortice Impianti - app dimostrativa di una ditta di idraulica e clima
   inventata. Richieste, foto e contratto restano in questo browser.
   ===================================================================== */
(function () {
  'use strict';
  var d = document, ic = X.ic, esc = X.esc, euro = X.euro;
  var SERV = [
    { id: 'rubinetto', c: 'idraulica', ic: 'goccia', n: 'Perdita dal rubinetto', s: 'Gocciola o non chiude bene', min: 60, max: 110, mano: '30–60 minuti', mat: 'cartuccia o guarnizioni', img: 'img/lavello.webp', w: 1200, h: 896, alt: 'Sotto un lavello: sifone smontato, chiave inglese, nastro di teflon e un secchio', top: 1, come: ['Chiudiamo l\'acqua e smontiamo il rubinetto', 'Cambiamo cartuccia o guarnizioni', 'Se è troppo vecchio ti proponiamo il cambio, con il prezzo prima', 'Proviamo acqua calda e fredda davanti a te'] },
    { id: 'scarico', c: 'idraulica', ic: 'filtro', n: 'Scarico intasato', s: 'Lavandino, doccia o wc', min: 70, max: 140, mano: '30–60 minuti', mat: 'di solito nessuno', top: 1, come: ['Capiamo dove si ferma l\'acqua', 'Sonda a molla o pompa, senza prodotti aggressivi', 'Pulizia del sifone', 'Prova con acqua a pieno flusso'] },
    { id: 'caldaia', c: 'caldaia', ic: 'fiamma', n: 'Caldaia in blocco', s: 'Non parte, poca pressione', min: 90, max: 220, mano: '1–2 ore', mat: 'dipende dal pezzo', img: 'img/caldaia.webp', w: 896, h: 1200, alt: 'Caldaia bianca a parete con tubi di rame e una cassetta degli attrezzi', top: 1, come: ['Leggiamo il codice di errore', 'Controllo di pressione, sonde e scheda', 'Se serve un pezzo te lo diciamo con il prezzo', 'Riaccensione e prova dei termosifoni'] },
    { id: 'boiler', c: 'caldaia', ic: 'goccia', n: 'Sostituzione scaldabagno', s: 'Elettrico da 80 litri, posa compresa', min: 290, max: 420, mano: '2–3 ore', mat: 'scaldabagno nuovo compreso', come: ['Sopralluogo con foto per vedere spazio e attacchi', 'Smontiamo e portiamo via il vecchio', 'Montiamo il nuovo con valvola di sicurezza', 'Primo riempimento e prova'] },
    { id: 'clima', c: 'clima', ic: 'clima', n: 'Pulizia condizionatore', s: 'Filtri e igienizzazione, per split', min: 60, max: 80, mano: '45 minuti a split', mat: 'prodotto igienizzante', top: 1, come: ['Pulizia dei filtri e della batteria interna', 'Igienizzazione contro i cattivi odori', 'Controllo dello scarico della condensa', 'Prova in freddo e in caldo'] },
    { id: 'gas', c: 'clima', ic: 'clima', n: 'Ricarica gas condizionatore', s: 'Non raffredda più', min: 90, max: 160, mano: '1 ora circa', mat: 'gas refrigerante', come: ['Cerchiamo prima la perdita', 'Ripariamo il punto che perde', 'Ricarica con la quantità giusta', 'Misura della temperatura in uscita'] },
    { id: 'perdita', c: 'idraulica', ic: 'goccia', n: 'Perdita d\'acqua nel muro', s: 'Macchie sul muro, bollette alte', min: 120, max: 300, mano: 'mezza giornata', mat: 'raccordi e tubo', come: ['Ricerca della perdita senza rompere a caso', 'Apertura minima del muro', 'Riparazione del tubo', 'Chiusura con malta; la pittura è a parte'] }
  ];
  var CAT = [['tutti', 'Tutti'], ['idraulica', 'Idraulica'], ['caldaia', 'Caldaie e boiler'], ['clima', 'Clima']];
  var FASCE = [['dm', 'Domani mattina', '8:00–12:00', 0], ['dp', 'Domani pomeriggio', '14:00–18:00', 0], ['ds', 'Domani sera', '18:00–20:00', 20], ['gg', 'Giovedì', 'tutto il giorno', 0]];
  var UR = [['allaga', 'Sta allagando', 'Chiudiamo e ripariamo la perdita'], ['freddo', 'Niente riscaldamento', 'Caldaia in blocco o spenta'], ['wc', 'WC o scarico bloccato', 'Non si può usare il bagno']];
  var PIANI = [
    { id: 'base', n: 'Base', p: 89, s: 'Controllo annuale, analisi dei fumi e bollino.' },
    { id: 'sereno', n: 'Sereno', p: 149, s: 'In più: uscite urgenti senza diritto di chiamata e 15% di sconto sui pezzi.', cons: 1 },
    { id: 'tutto', n: 'Tutto compreso', p: 229, s: 'In più: pezzi di ricambio fino a 200 € l\'anno e priorità il giorno stesso.' }
  ];
  var STORICO = [{ n: 'Sostituzione rubinetto cucina', d: '14 ott', t: 'Luca', e: '95 €', p: 'Miscelatore nuovo, garanzia 2 anni.' }, { n: 'Pulizia di 2 split', d: '12 giu', t: 'Sara', e: '120 €', p: 'Filtri lavati, igienizzazione fatta.' }, { n: 'Vaso di espansione caldaia', d: '3 feb', t: 'Luca', e: '140 €', p: 'Pressione tornata stabile a 1,4 bar.' }];
  var mem = X.memoria('vortice'), st, req, urg = 'allaga', cat = 'tutti', timer = null, sel = null;
  function carica() {
    st = mem.get('stato', { int: null, piano: null, fatti: [] });
    req = { tipo: 'rubinetto', dove: 'Cucina', desc: '', foto: null, fascia: 'dm' };
    sel = null;
  }
  var salva = function () { mem.set('stato', st); };
  var serv = function (id) { return SERV.filter(function (t) { return t.id === id; })[0]; };
  var storicoTutto = function () { return (st.fatti || []).concat(STORICO); };
  var piano = function (id) { return PIANI.filter(function (p) { return p.id === id; })[0]; };

  /* tre modi di mostrare un servizio */
  function rigaServ(s) {
    return '<li><a class="nx-cella ic" href="#/servizio/' + s.id + '"><span class="nx-c-ic">' + ic(s.ic) + '</span><span class="nx-c-tx"><b>' + esc(s.n) + '</b><small>' + esc(s.s) + '</small></span><span class="nx-c-dx v-pr nx-num">' + s.min + '–' + s.max + ' €</span><i class="nx-chev"></i></a></li>';
  }
  function schedaServ(s) {
    return '<li class="v-sch"><a href="#/servizio/' + s.id + '">' + (s.img && !(X.vista() === 'home' && s.id === 'caldaia') ? '<img class="v-sch-f" src="' + s.img + '" alt="' + esc(s.alt) + '" width="' + s.w + '" height="' + s.h + '" decoding="async">' : '<span class="v-sch-ic">' + ic(s.ic) + '</span>') +
      '<span class="v-sch-tx"><b>' + esc(s.n) + '</b><small>' + esc(s.s) + '</small><span class="v-sch-p nx-num">' + s.min + '–' + s.max + ' € <small>indicativo</small></span></span></a></li>';
  }
  function tessServ(s) {
    return '<li><a class="v-tes" href="#/servizio/' + s.id + '" data-nx-premi><span class="x-ico-q">' + ic(s.ic) + '</span><b>' + esc(s.n) + '</b><small class="nx-num">' + s.min + '–' + s.max + ' €</small></a></li>';
  }
  function elencoServ(l) {
    var s = X.stile();
    if (s === 'b') return '<ul class="v-schede">' + l.map(schedaServ).join('') + '</ul>';
    if (s === 'c') return '<ul class="v-tessere">' + l.map(tessServ).join('') + '</ul>';
    return '<ul class="nx-lista">' + l.map(rigaServ).join('') + '</ul>';
  }
  function bandoUrg() {
    return '<a class="v-urg" href="#/tecnico" data-nx-premi><span class="v-urg-ic">' + ic('allerta') + '</span><span><b>Intervento urgente</b><small>Perdita, niente caldo o bagno bloccato: un tecnico entro 2 ore, sabato compreso</small></span><i class="nx-chev"></i></a>';
  }
  function bandoInCorso() {
    if (!st.int) return '';
    var u = st.int.tipo === 'urgente';
    return '<a class="x-card v-incorso" href="#/tecnico"><span class="nx-pill ' + (u ? 'wait' : 'info') + '">' + (u ? 'Tecnico in arrivo' : 'Programmato') + '</span><b>' + esc(st.int.titolo) + '</b><small>' + (u ? 'Tocca per seguirlo sulla mappa' : esc(st.int.quando)) + '</small></a>';
  }
  function bandoContr() {
    var p = st.piano && piano(st.piano);
    return '<a class="x-card v-contr" href="#/caldaia"><span class="x-ico-q">' + ic('fiamma') + '</span><span class="nx-c-tx"><b>' + (p ? 'Contratto ' + p.n + ' attivo' : 'Bollino della caldaia in scadenza') + '</b><small>' + (p ? 'Il controllo lo fissiamo noi e ti avvisiamo prima.' : 'Con un contratto ci pensiamo noi ogni anno.') + '</small></span><i class="nx-chev"></i></a>';
  }
  function storicoBreve() {
    return '<ul class="nx-lista">' + storicoTutto().slice(0, 2).map(function (s) { return '<li><div class="nx-cella"><span class="nx-c-tx"><b>' + esc(s.n) + '</b><small>' + esc(s.d) + ' · ' + esc(s.t) + ' · ' + esc(s.e) + '</small></span></div></li>'; }).join('') + '</ul>';
  }

  /* ---------- viste ---------- */
  function vHome() {
    var s = X.stile(), top = SERV.filter(function (x) { return x.top; });
    if (s === 'b') {
      return '<div class="v-hero"><img src="img/caldaia.webp" width="896" height="1200" alt="Caldaia bianca a parete con tubi di rame e una cassetta degli attrezzi a terra" fetchpriority="high" decoding="async"><div class="v-hero-tx"><p>Idraulica, caldaie e clima</p><h1 class="v-hero-h">Che problema hai in casa?</h1></div></div>' +
        bandoInCorso() + bandoUrg() + '<h2 class="x-h2">I lavori più richiesti<small>Il prezzo lo vedi prima, il tecnico lo conferma prima di iniziare</small></h2>' + elencoServ(top) +
        '<h2 class="x-h2">Come lavoriamo</h2><ol class="v-passi"><li><b>Mandi una foto</b><span>Capiamo il guasto e portiamo il pezzo giusto.</span></li><li><b>Vedi il prezzo</b><span>Una forbice onesta, uscita compresa.</span></li><li><b>Ti diciamo quando</b><span>Fascia di due ore, avviso mezz\'ora prima.</span></li><li><b>Paghi alla fine</b><span>Anche con carta, ricevuta per email.</span></li></ol>' + bandoContr();
    }
    if (s === 'c') {
      return '<h1 class="nx-tit-grande x-tit">Vortice</h1>' + bandoInCorso() +
        '<div class="v-stato"><a href="#/tecnico" class="v-st-u" data-nx-premi>' + ic('allerta') + '<b>Urgenza</b><small>tecnico in 2 ore</small></a><a href="#/richiesta" class="v-st-p" data-nx-premi>' + ic('foto') + '<b>Richiesta</b><small>con foto e prezzo</small></a></div>' +
        '<h2 class="x-h2">Servizi</h2>' + elencoServ(SERV) + '<h2 class="x-h2">Caldaia</h2>' + bandoContr();
    }
    return '<h1 class="nx-tit-grande x-tit">Che problema hai?</h1>' + bandoInCorso() + bandoUrg() +
      '<h2 class="x-h2">Più richiesti</h2>' + elencoServ(top) + '<a class="nx-btn t v-tutti" href="#/servizi">Tutti i servizi e i prezzi</a>' +
      '<h2 class="x-h2">La tua caldaia</h2>' + bandoContr() + '<h2 class="x-h2">Ultimi interventi</h2>' + storicoBreve();
  }
  function vServizi() {
    var l = SERV.filter(function (s) { return cat === 'tutti' || s.c === cat; });
    return '<h1 class="nx-tit-grande x-tit">Servizi e prezzi</h1><div class="nx-chips v-chips" role="group" aria-label="Filtra i servizi">' + CAT.map(function (c) { return '<button type="button" class="nx-chip" data-v-cat="' + c[0] + '" aria-pressed="' + (c[0] === cat) + '">' + c[1] + '</button>'; }).join('') + '</div>' +
      elencoServ(l) + '<p class="x-nota">Prezzi indicativi, IVA e uscita comprese. Il prezzo finale lo conferma il tecnico prima di iniziare.</p>';
  }
  function vServizio(id) {
    var s = serv(id) || SERV[0];
    return (s.img ? '<img class="x-foto v-sv-f" src="' + s.img + '" alt="' + esc(s.alt) + '" width="' + s.w + '" height="' + s.h + '" decoding="async">' : '<div class="v-sv-ic">' + ic(s.ic) + '</div>') +
      '<h1 class="nx-tit-grande x-tit v-sv-t">' + esc(s.n) + '</h1><p class="x-sub">' + esc(s.s) + '</p>' +
      '<div class="x-card x-pad v-range"><small>Prezzo indicativo, uscita compresa</small><b class="nx-num">' + s.min + '–' + s.max + ' €</b><small>Durata ' + esc(s.mano) + ' · materiale: ' + esc(s.mat) + '</small></div>' +
      '<h2 class="x-h2">Cosa facciamo</h2><ol class="v-come">' + s.come.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ol>' +
      '<div class="x-avviso info">' + ic('foto') + '<span>Con una foto il tecnico capisce prima e arriva con il pezzo giusto.</span></div>' +
      '<div class="x-azioni"><a class="nx-btn p" href="#/richiesta/' + s.id + '">' + ic('foto') + 'Prenota con una foto</a><a class="nx-btn" href="#/tecnico">È urgente</a></div>';
  }
  function conto() { var t = serv(req.tipo), f = FASCE.filter(function (x) { return x[0] === req.fascia; })[0]; return { t: t, f: f, min: t.min + f[3], max: t.max + f[3] }; }
  function riepilogo() {
    var c = conto();
    return '<p><span>' + esc(c.t.n) + '</span><span>' + c.t.min + '–' + c.t.max + ' €</span></p><p><span>Uscita e diagnosi</span><span>compresa</span></p><p><span>Durata stimata</span><span>' + esc(c.t.mano) + '</span></p>' +
      (c.f[3] ? '<p><span>Fascia serale</span><span>+' + c.f[3] + ' €</span></p>' : '') + '<p class="t"><span>Preventivo</span><span class="nx-num">' + c.min + '–' + c.max + ' €</span></p>' +
      '<small>' + (req.foto ? 'Con la foto di solito si risolve in una sola uscita.' : 'Senza foto la stima resta più larga.') + (st.piano === 'sereno' || st.piano === 'tutto' ? ' Con il tuo contratto i pezzi sono scontati.' : '') + '</small>';
  }
  function fotoHtml() {
    return req.foto ? '<div class="v-ant"><img src="' + req.foto + '" alt="Foto del problema scelta da te" width="800" height="600"><span><b>Foto pronta</b><small>La vede il tecnico prima di uscire</small></span><button type="button" class="nx-btn t r" data-v="togli">Togli</button></div>'
      : '<div class="v-foto"><label class="nx-btn p v-carica" data-nx-premi>' + ic('foto') + '<span>Scatta o scegli una foto</span><input id="v-file" class="nx-sr" type="file" accept="image/*"></label><button type="button" class="nx-btn" data-v="esempio">Usa una foto di esempio</button></div>';
  }
  function vRichiesta(id) {
    if (id && serv(id)) req.tipo = id;
    if (sel === 'inviata') {
      return '<h1 class="nx-tit-grande x-tit">Richiesta inviata</h1><div class="x-card x-fatto nx-scala"><span class="x-spunta">' + ic('ok') + '</span><h2>Ci pensiamo noi.</h2><p>' + esc(st.int ? st.int.titolo : '') + '</p><p>' + esc(st.int ? st.int.quando : '') + '</p><p>Ti richiamiamo entro un\'ora per confermare l\'orario.</p></div>' +
        '<div class="x-azioni"><a class="nx-btn p" href="#/tecnico">Segui la richiesta</a><button type="button" class="nx-btn t" data-v="nuova">Fai un\'altra richiesta</button></div>';
    }
    return '<h1 class="nx-tit-grande x-tit">Nuova richiesta</h1>' +
      '<label class="nx-campo"><span>Cosa devi sistemare</span><select id="v-tipo">' + SERV.map(function (t) { return '<option value="' + t.id + '"' + (t.id === req.tipo ? ' selected' : '') + '>' + esc(t.n) + '</option>'; }).join('') + '</select></label>' +
      '<label class="nx-campo"><span>Dove</span><select id="v-dove">' + ['Bagno', 'Cucina', 'Lavanderia', 'Soggiorno o camera', 'Esterno o balcone'].map(function (x) { return '<option' + (x === req.dove ? ' selected' : '') + '>' + x + '</option>'; }).join('') + '</select></label>' +
      '<label class="nx-campo"><span>Due parole su cosa vedi</span><textarea id="v-desc" rows="3" placeholder="Es. gocciola sotto il lavandino quando apro l\'acqua calda">' + esc(req.desc) + '</textarea></label>' +
      '<p class="x-lab">Foto del problema</p><div id="v-foto">' + fotoHtml() + '</div>' +
      '<p class="x-lab">Quando possiamo venire</p><div class="x-scelte">' + FASCE.map(function (f) { return '<label class="x-scelta"><input type="radio" name="v-fascia" value="' + f[0] + '"' + (f[0] === req.fascia ? ' checked' : '') + '><span class="x-sp">' + f[1] + '<small>' + f[2] + '</small></span><em>' + (f[3] ? '+' + f[3] + ' €' : '') + '</em><i></i></label>'; }).join('') + '</div>' +
      '<div class="x-conto" id="v-conto" aria-live="polite">' + riepilogo() + '</div>' +
      '<p class="x-err" id="v-err" role="alert"></p><div class="x-azioni"><button type="button" class="nx-btn p" data-v="invia">Conferma la richiesta</button></div>' +
      '<p class="x-nota">Demo: non inviamo nulla. Nella versione vera la richiesta arriva in ufficio con la foto.</p>';
  }
  function vTecnico() {
    clearInterval(timer);
    if (!st.int) {
      return '<h1 class="nx-tit-grande x-tit">Intervento urgente</h1><p class="x-sub">Un tecnico entro 2 ore, dalle 7 alle 22, sabato compreso. Uscita urgente 60 €, poi il lavoro.</p>' +
        '<p class="x-lab">Cosa succede</p><div class="x-scelte">' + UR.map(function (u) { return '<label class="x-scelta"><input type="radio" name="v-urg" value="' + u[0] + '"' + (u[0] === urg ? ' checked' : '') + '><span class="x-sp">' + u[1] + '<small>' + u[2] + '</small></span><i></i></label>'; }).join('') + '</div>' +
        '<p class="x-lab">Indirizzo</p><ul class="nx-lista"><li><div class="nx-cella ic"><span class="nx-c-ic">' + ic('pin') + '</span><span class="nx-c-tx"><b>Via Manzoni 7, scala B</b><small>2° piano, citofono Rinaldi</small></span></div></li></ul>' +
        '<div class="x-avviso">' + ic('goccia') + '<span>Se perde acqua, chiudi il rubinetto generale: di solito è sotto il lavello o vicino al contatore.</span></div>' +
        '<div class="x-azioni"><button type="button" class="nx-btn p v-btn-u" data-v="manda">Mandate un tecnico</button></div><p class="x-nota">Demo: nessuna chiamata parte davvero.</p>';
    }
    var i = st.int, prog = i.tipo !== 'urgente';
    var FA = prog ? [['Richiesta ricevuta', 'con foto e descrizione'], ['Orario confermato', i.quando], ['Tecnico in arrivo', 'quel giorno ti avvisiamo 30 minuti prima'], ['Lavoro fatto', 'paghi al tecnico, anche con carta']]
      : [['Richiesta ricevuta', 'oggi alle ' + i.ora], ['Tecnico assegnato', 'Luca ha il furgone con i pezzi'], ['In viaggio verso di te', ''], ['Arrivato', 'suona al citofono Rinaldi']];
    return '<h1 class="nx-tit-grande x-tit">' + (prog ? 'Intervento programmato' : 'Il tecnico sta arrivando') + '</h1>' +
      '<div class="x-card x-pad v-eta" aria-live="polite"><small>' + (prog ? 'Quando' : 'Arrivo stimato') + '</small><b id="v-eta" class="nx-num">' + (prog ? esc(i.quando.split(',')[0]) : i.min + ' min') + '</b><small>' + esc(prog ? (i.quando.split(',')[1] || '').trim() + ' · ' + i.titolo : i.titolo) + '</small></div>' +
      (prog ? '' : '<div class="v-mappa"><svg viewBox="0 0 360 180" role="img" aria-label="Mappa stilizzata con il furgone del tecnico che si avvicina"><rect width="360" height="180" fill="#E6ECF3"/><g stroke="#fff" stroke-width="10" fill="none"><path d="M0 60h360M0 130h360M90 0v180M250 0v180"/></g><path id="v-path" d="M30 130H90V60H250V130H320" fill="none" stroke="#1E5AA8" stroke-width="4" stroke-dasharray="8 6"/><circle cx="320" cy="130" r="12" fill="#C4141F"/><path d="M314 131l6-6 6 6v6h-12z" fill="#fff"/><g id="v-van"><rect x="-13" y="-8" width="26" height="16" rx="3" fill="#0E2A47"/><circle cx="-7" cy="9" r="3" fill="#0E2A47"/><circle cx="7" cy="9" r="3" fill="#0E2A47"/></g></svg></div>') +
      '<ul class="nx-lista v-tec"><li><div class="nx-cella"><span class="nx-av" aria-hidden="true">LB</span><span class="nx-c-tx"><b>Luca Bertoni</b><small>Idraulico e caldaie, 12 anni con noi</small></span><button type="button" class="nx-btn ico" data-v="chiama" aria-label="Chiama Luca">' + ic('tel') + '</button></div></li></ul>' +
      '<div class="x-card x-pad"><ol class="x-fasi" id="v-fasi">' + FA.map(function (f) { return '<li><b>' + esc(f[0]) + '</b><small>' + esc(f[1]) + '</small></li>'; }).join('') + '</ol></div>' +
      '<div class="x-azioni">' + (!prog ? '<button type="button" class="nx-btn p" data-v="fine" id="v-fine"' + (i.min > 0 ? ' hidden' : '') + '>Lavoro finito: aggiungi allo storico</button>' : '') + '<button type="button" class="nx-btn t r" data-v="annulla">Annulla la richiesta</button></div>' +
      (prog ? '' : '<p class="x-nota">Demo: il tempo scorre più veloce del vero, un minuto ogni due secondi.</p>');
  }
  function aggiorna() {
    var i = st.int; if (!i) return;
    var prog = i.tipo !== 'urgente', fase = prog ? 1 : (i.min <= 0 ? 3 : 2);
    d.querySelectorAll('#v-fasi li').forEach(function (li, k) { li.className = k < fase ? 'ok' : k === fase ? 'ora' : ''; });
    if (prog) return;
    var e = d.getElementById('v-eta'); if (e) e.textContent = i.min > 0 ? i.min + ' min' : 'Arrivato';
    var p = d.getElementById('v-path'), v = d.getElementById('v-van');
    if (p && v && p.getTotalLength) { var L = p.getTotalLength(), pt = p.getPointAtLength(L * Math.min(1, (25 - i.min) / 25)); v.setAttribute('transform', 'translate(' + pt.x + ' ' + (pt.y - 2) + ')'); }
    var f2 = d.querySelectorAll('#v-fasi li')[2]; if (f2) f2.querySelector('small').textContent = i.min > 0 ? 'mancano circa ' + i.min + ' minuti' : 'è arrivato';
    var fi = d.getElementById('v-fine'); if (fi) fi.hidden = i.min > 0;
  }
  function dopoTecnico() {
    aggiorna();
    if (st.int && st.int.tipo === 'urgente' && st.int.min > 0) timer = setInterval(function () {
      if (!st.int || st.int.min <= 0) { clearInterval(timer); return; }
      st.int.min--; salva(); aggiorna();
    }, 2000);
  }
  function vStorico() {
    var att = st.int ? '<ul class="nx-lista"><li><a class="nx-cella" href="#/tecnico"><span class="nx-c-tx"><b>' + esc(st.int.titolo) + '</b><small>' + (st.int.tipo === 'urgente' ? 'Tecnico in arrivo' : esc(st.int.quando)) + '</small></span><span class="nx-pill wait">' + (st.int.tipo === 'urgente' ? 'In corso' : 'Programmato') + '</span><i class="nx-chev"></i></a></li></ul><h2 class="x-h2">Fatti</h2>' : '';
    return '<h1 class="nx-tit-grande x-tit">I tuoi interventi</h1>' + att +
      '<ul class="nx-lista v-sto">' + storicoTutto().map(function (s) { return '<li><div class="nx-cella"><span class="nx-c-tx"><b>' + esc(s.n) + '</b><small>' + esc(s.d) + ' · ' + esc(s.t) + ' · ' + esc(s.e) + '</small><small class="v-sto-p">' + esc(s.p) + '</small></span><span class="nx-pill ok">Fatto</span></div></li>'; }).join('') + '</ul>' +
      '<h2 class="x-h2">Impianto</h2>' + bandoContr();
  }
  function vCaldaia() {
    var oggi = new Date(); oggi.setHours(12, 0, 0, 0);
    var sc = new Date(oggi.getFullYear(), 10, 18, 12); if (sc < oggi) sc.setFullYear(sc.getFullYear() + 1);
    var gg = Math.round((sc - oggi) / 864e5), cur = sel && piano(sel) ? sel : (st.piano || 'sereno'), s = piano(cur);
    return '<div class="v-cald"><img src="img/caldaia.webp" width="896" height="1200" alt="Caldaia bianca a parete con tubi di rame e una cassetta degli attrezzi a terra" decoding="async"><div><h1 class="v-cald-t">La tua caldaia</h1><p>A condensazione, 24 kW<br>Installata nel 2021 · lavanderia</p><span class="nx-pill ' + (st.piano ? 'ok' : 'wait') + '">' + (st.piano ? 'Controllo fissato da noi' : (gg <= 1 ? 'Il bollino scade domani' : 'Il bollino scade tra ' + gg + ' giorni')) + '</span></div></div>' +
      '<h2 class="x-h2">Contratto di manutenzione</h2><div class="x-scelte">' + PIANI.map(function (p) { return '<label class="x-scelta v-piano"><input type="radio" name="v-piano" value="' + p.id + '"' + (p.id === cur ? ' checked' : '') + '><span class="x-sp">' + p.n + (p.cons ? ' <span class="nx-pill acc">Il più scelto</span>' : '') + '<small>' + esc(p.s) + '</small></span><em class="nx-num">' + p.p + ' €<small>/anno</small></em><i></i></label>'; }).join('') + '</div>' +
      '<div class="x-card x-pad v-riep" aria-live="polite">' + (st.piano === s.id ? '<b>Contratto ' + s.n + ' attivo.</b><p>Il prossimo controllo lo fissiamo noi e ti scriviamo una settimana prima.</p><button type="button" class="nx-btn t r" data-v="disdici">Disdici il contratto</button>'
        : '<b>' + s.n + ': ' + s.p + ' € l\'anno</b><p>Si paga al primo controllo. Si disdice quando vuoi, prima del rinnovo.</p><button type="button" class="nx-btn p pieno" data-v="attiva">Attiva il contratto</button>') + '</div>' +
      '<h2 class="x-h2">Libretto dell\'impianto</h2><ul class="x-kv"><li><span>Controllo e pulizia annuale</span><span>18 nov 2025</span></li><li><span>Vaso di espansione, 140 €</span><span>3 feb 2025</span></li><li><span>Prima accensione</span><span>12 ott 2021</span></li></ul>';
  }

  d.addEventListener('change', function (e) {
    var t = e.target;
    if (t.id === 'v-file' && t.files && t.files[0]) {
      if (!/^image\//.test(t.files[0].type)) { NX.toast('Serve una foto (jpg, png o heic).', 'no'); return; }
      req.foto = URL.createObjectURL(t.files[0]); d.getElementById('v-foto').innerHTML = fotoHtml(); aggiornaConto();
    }
    else if (t.id === 'v-tipo') { req.tipo = t.value; aggiornaConto(); }
    else if (t.id === 'v-dove') req.dove = t.value;
    else if (t.name === 'v-fascia') { req.fascia = t.value; aggiornaConto(); }
    else if (t.name === 'v-urg') urg = t.value;
    else if (t.name === 'v-piano') { sel = t.value; X.ridisegna(); }
  });
  d.addEventListener('input', function (e) { if (e.target.id === 'v-desc') { req.desc = e.target.value; var er = d.getElementById('v-err'); if (er) er.textContent = ''; } });
  function aggiornaConto() { var c = d.getElementById('v-conto'); if (c) { c.innerHTML = riepilogo(); c.classList.remove('nx-scala'); void c.offsetWidth; c.classList.add('nx-scala'); } }
  d.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var a = b.getAttribute('data-v');
    if (b.hasAttribute('data-v-cat')) { cat = b.getAttribute('data-v-cat'); X.ridisegna(); }
    else if (a === 'esempio') { req.foto = 'img/lavello.webp'; d.getElementById('v-foto').innerHTML = fotoHtml(); aggiornaConto(); }
    else if (a === 'togli') { req.foto = null; d.getElementById('v-foto').innerHTML = fotoHtml(); aggiornaConto(); }
    else if (a === 'invia') {
      req.desc = (d.getElementById('v-desc').value || '').trim();
      if (req.desc.length < 8 && !req.foto) { d.getElementById('v-err').textContent = 'Scrivi due parole o aggiungi una foto: al tecnico serve capire cosa portare.'; return; }
      var c = conto(); st.int = { tipo: 'prog', quando: c.f[1] + ', ' + c.f[2], titolo: c.t.n, prezzo: c.min + '–' + c.max + ' €' }; salva();
      sel = 'inviata'; X.ridisegna(); window.scrollTo(0, 0);
    }
    else if (a === 'nuova') { sel = null; req.foto = null; req.desc = ''; X.ridisegna(); }
    else if (a === 'manda') { var dt = new Date(); st.int = { tipo: 'urgente', min: 25, ora: dt.getHours() + ':' + ('0' + dt.getMinutes()).slice(-2), titolo: UR.filter(function (u) { return u[0] === urg; })[0][1] }; salva(); X.ridisegna(); window.scrollTo(0, 0); }
    else if (a === 'fine') { st.fatti = st.fatti || []; st.fatti.unshift({ n: 'Urgenza: ' + st.int.titolo.toLowerCase(), d: 'oggi', t: 'Luca', e: 'da 60 €', p: 'Ricevuta per email nella versione vera.' }); st.int = null; salva(); X.vai('#/storico'); NX.toast('Aggiunto allo storico.'); }
    else if (a === 'annulla') { clearInterval(timer); st.int = null; salva(); X.ridisegna(); NX.toast('Richiesta annullata.'); }
    else if (a === 'chiama') NX.toast('Demo: nessuna chiamata parte davvero.', 'info');
    else if (a === 'attiva') { st.piano = sel || 'sereno'; salva(); X.ridisegna(); NX.toast('Contratto attivato.'); }
    else if (a === 'disdici') { st.piano = null; sel = null; salva(); X.ridisegna(); NX.toast('Contratto disdetto.'); }
  });

  carica();
  X.avvia({
    chiave: 'vortice', mem: mem, nome: 'Vortice Impianti', home: 'home',
    striscia: 'App dimostrativa di un\'attività inventata · Prezzi, tempi e tecnici sono di esempio · Foto generate con l\'IA',
    marchio: '<a class="x-marchio" href="#/home" aria-label="Vortice Impianti, torna alla home"><svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" fill="#0E2A47"/><path d="M16 6c5 6 7 9 7 12a7 7 0 0 1-14 0c0-3 2-6 7-12z" fill="#FF7A1A"/></svg><span>Vortice<small>idraulica e clima</small></span></a>',
    stili: { a: ['Classico', 'Liste raggruppate e barra delle schede, come le app di sistema.'], b: ['Editoriale', 'Foto grande, lavori raccontati in schede ampie e come lavoriamo.'], c: ['Compatto', 'Griglia di servizi con i prezzi, urgenza e richiesta sempre in vista.'] },
    tab: [['home', 'Home', 'casa'], ['servizi', 'Servizi', 'chiave'], ['tecnico', 'Tecnico', 'allerta'], ['storico', 'Storico', 'storico']],
    fab: ['#/tecnico', 'Urgenza', 'allerta'],
    azzera: function () { clearInterval(timer); carica(); },
    viste: {
      home: { tit: 'Vortice Impianti', render: vHome },
      servizi: { tit: 'Servizi e prezzi', render: vServizi },
      servizio: { tit: function (id) { return (serv(id) || SERV[0]).n; }, render: vServizio, livello: 1, tab: 'servizi', indietro: ['#/servizi', 'Servizi'] },
      richiesta: { tit: 'Nuova richiesta', render: vRichiesta, livello: 2, tab: 'servizi', indietro: function (id) { return id ? ['#/servizio/' + id, 'Servizio'] : ['#/home', 'Home']; }, lascia: function () { if (sel === 'inviata') sel = null; } },
      tecnico: { tit: 'Tecnico', render: vTecnico, dopo: dopoTecnico, lascia: function () { clearInterval(timer); } },
      storico: { tit: 'I tuoi interventi', render: vStorico },
      caldaia: { tit: 'La tua caldaia', render: vCaldaia, livello: 1, tab: 'storico', indietro: ['#/storico', 'Storico'], lascia: function () { sel = null; } }
    }
  });
})();
