/* Libeccio - app dimostrativa. Nessun dato viene inviato: la prenotazione resta in questo browser. Meteo di esempio. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var mem = {
    get: function (k, d) { try { var v = localStorage.getItem('libeccio-' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('libeccio-' + k, JSON.stringify(v)); } catch (e) {} }
  };
  var B = [
    { id: 'gozzo', t: 'motore', n: 'Gozzo Marinella', m: 5.8, cv: 40, posti: 6, pat: 0, sk: 0, p: 180, desc: 'Il gozzo in legno per girare le cale vicine al porto. Si guida in un attimo, anche la prima volta.', inc: ['Tendalino parasole', 'Scaletta da bagno', 'Ancora e cima', 'Spiegazione di 20 minuti prima di partire'], col: '#C9773D' },
    { id: 'scirocco', t: 'gommone', n: 'Gommone Scirocco', m: 6.5, cv: 40, posti: 8, pat: 0, sk: 1, p: 240, img: 'img/gommone.webp', alt: 'Gommone bianco all\'ancora in una caletta turchese', desc: 'Veloce il giusto e stabile: perfetto per famiglie. Non serve la patente nautica.', inc: ['Prendisole a prua', 'Doccetta d\'acqua dolce', 'Frigo portatile', 'Kit di sicurezza e radio'] },
    { id: 'grecale', t: 'motore', n: 'Open Grecale 7', m: 7.2, cv: 150, posti: 8, pat: 1, sk: 1, p: 390, img: 'img/motore.webp', alt: 'Barca a motore bianca con tendalino blu ormeggiata a un molo di pietra davanti a case colorate', desc: 'Per arrivare lontano in poco tempo: isole e grotte in giornata. Serve la patente nautica, altrimenti viene uno skipper.', inc: ['Tendalino blu', 'Ecoscandaglio e GPS', 'Doccetta', 'Tavolino a poppa'] },
    { id: 'maestrale', t: 'vela', n: 'Barca a vela Maestrale', m: 12, cv: 30, posti: 8, pat: 1, sk: 1, p: 520, img: 'img/vela.webp', alt: 'Barca a vela bianca con le vele alzate su mare blu davanti a una costa di roccia', desc: 'Dodici metri, due cabine e una cucina: si esce la mattina e si rientra al tramonto, o si dorme in rada.', inc: ['Due cabine doppie', 'Cucina e frigo', 'Tender per scendere a terra', 'Teli mare per tutti'] },
    { id: 'tramontana', t: 'vela', n: 'Catamarano Tramontana', m: 13.5, cv: 60, posti: 10, pat: 1, sk: 2, p: 890, desc: 'Ampio e stabile, con la rete a prua per stendersi. Solo con skipper, il pranzo a bordo è compreso.', inc: ['Skipper sempre compreso', 'Pranzo a bordo', 'Maschere e boccagli', 'Tavola SUP'], col: '#2B6A94' }
  ];
  var TIPI = [['tutte', 'Tutte'], ['gommone', 'Gommoni'], ['motore', 'A motore'], ['vela', 'A vela']];
  var EXTRA = [['carb', 'Pieno di carburante', 'paghi solo quello che usi, si calcola al rientro', 0], ['snork', 'Maschere e pinne', 'per 6 persone', 25], ['sup', 'Tavola SUP', 'con pagaia e giubbotto', 40], ['pranzo', 'Pranzo a bordo', 'pane, frutta, insalata di riso, acqua', 18, 1], ['ghiaccio', 'Ghiaccio e bibite', 'nel frigo all\'imbarco', 30]];
  var DUR = [['mattina', 'Mezza giornata, mattina', '9:00–13:00', 0.6], ['pome', 'Mezza giornata, pomeriggio', '14:00–19:00', 0.6], ['giorno', 'Giornata intera', '9:00–19:00', 1]];
  var SKIPPER = 150;
  var st = mem.get('stato', { pren: [] });
  var sel = { g: 1, pers: 4, sk: 'no', tipo: 'tutte', pat: false, barca: 'scirocco', dur: 'giorno', extra: { carb: 1 }, md: 1 };
  var GG = ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'];
  var MM = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];
  var giorno = function (k) { var d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + k); return d; };
  var byId = function (id) { return B.filter(function (b) { return b.id === id; })[0]; };
  var euro = function (n) { return Math.round(n).toLocaleString('it-IT') + ' €'; };
  var DIR = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
  var NOMI = { N: 'Tramontana', NE: 'Grecale', E: 'Levante', SE: 'Scirocco', S: 'Ostro', SO: 'Libeccio', O: 'Ponente', NO: 'Maestrale' };
  /* meteo di esempio, sempre uguale per lo stesso giorno */
  function meteo(k) {
    var d = giorno(k).getDate(), v = 5 + (d * 7) % 17, dir = DIR[(d * 3) % 8];
    return { v: v, dir: dir, nome: NOMI[dir], mare: v < 9 ? 'calmo' : v < 14 ? 'poco mosso' : v < 19 ? 'mosso' : 'molto mosso', onda: (v / 22).toFixed(1), sole: v < 15, t: 18 + (d % 6), ore: [0, 1, 2, 3, 4].map(function (h) { return Math.max(3, v - 3 + ((d + h * 5) % 7)); }) };
  }
  function icona(m) {
    return m.sole ? '<svg viewBox="0 0 60 60" aria-hidden="true"><circle cx="30" cy="26" r="11" fill="#F6C453"/><g stroke="#F6C453" stroke-width="3" stroke-linecap="round"><path d="M30 6v5M30 41v5M10 26h5M45 26h5M16 12l3 3M41 37l3 3M44 12l-3 3M19 37l-3 3"/></g><path d="M8 52c6 4 12 4 18 0s12-4 18 0 10 3 12 2" fill="none" stroke="#8EC1E0" stroke-width="3"/></svg>'
      : '<svg viewBox="0 0 60 60" aria-hidden="true"><path d="M16 36h28a9 9 0 0 0 0-18 13 13 0 0 0-25-2 8 8 0 0 0-3 20z" fill="#DDE7F0"/><path d="M6 46h34M14 53h38" stroke="#F0644A" stroke-width="3" stroke-linecap="round"/></svg>';
  }
  function disegno(b) {
    return '<svg class="ill" viewBox="0 0 320 180" role="img" aria-label="Disegno della barca ' + b.n + '"><rect width="320" height="180" fill="#CFE2EE"/><path d="M0 120c40-8 80 8 120 0s80-8 120 0 60 6 80 2v58H0z" fill="#2B6A94"/>' +
      (b.t === 'vela' ? '<path d="M150 30v80H95zM158 40l45 70h-45z" fill="#FBF8F2"/><path d="M80 112h180l-25 22H100z" fill="#FBF8F2"/><path d="M60 118h70l-10 14H72zM190 118h70l-10 14h-50z" fill="' + b.col + '" opacity=".7"/>' : '<path d="M70 104h170l-22 26H95z" fill="' + b.col + '"/><path d="M110 104v-16h60l14 16z" fill="#FBF8F2"/><path d="M100 104h130" stroke="#FBF8F2" stroke-width="3"/>') + '</svg>';
  }
  function filtrate() { return B.filter(function (b) { return (sel.tipo === 'tutte' || b.t === sel.tipo) && (!sel.pat || !b.pat) && b.posti >= sel.pers && (sel.sk !== 'no' || b.sk < 2) && (sel.sk !== 'si' || b.sk >= 1); }); }
  function giorniHtml(attr) {
    var g = '';
    for (var k = 1; k <= 10; k++) { var d = giorno(k); g += '<button type="button" ' + attr + '="' + k + '" aria-pressed="' + (k === sel.g) + '"><small>' + (k === 1 ? 'domani' : GG[d.getDay()]) + '</small><b>' + d.getDate() + '</b></button>'; }
    return g;
  }
  function home() {
    $('#h-giorni').innerHTML = giorniHtml('data-g');
    $('#h-pers').textContent = sel.pers;
    $$('[data-sk]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.sk === sel.sk); });
    var n = filtrate().length; $('#h-vai').textContent = n ? 'Vedi ' + n + (n === 1 ? ' barca libera' : ' barche libere') : 'Nessuna barca: cambia i filtri';
    var m = meteo(sel.g), d = giorno(sel.g);
    $('#h-meteo').innerHTML = icona(m) + '<span><b>' + GG[d.getDay()] + ' ' + d.getDate() + ': ' + m.nome.toLowerCase() + ' ' + m.v + ' nodi</b><small>Mare ' + m.mare + ', ' + m.t + '° · previsioni di esempio</small></span><span aria-hidden="true">→</span>';
  }
  function flotta() {
    $('#fl-tipo').innerHTML = TIPI.map(function (t) { return '<button type="button" data-tipo="' + t[0] + '" aria-pressed="' + (t[0] === sel.tipo) + '">' + t[1] + '</button>'; }).join('');
    $('#fl-pat').checked = sel.pat;
    var l = filtrate();
    $('#fl-conta').textContent = l.length + (l.length === 1 ? ' barca' : ' barche') + ' per ' + sel.pers + ' persone, ' + (sel.sk === 'si' ? 'con skipper' : sel.sk === 'no' ? 'guidate da voi' : 'con o senza skipper');
    $('#fl-lista').innerHTML = l.length ? l.map(function (b) {
      return '<li><a href="#/barca/' + b.id + '">' + (b.img ? '<img src="' + b.img + '" alt="' + b.alt + '" width="640" height="360" loading="lazy">' : disegno(b)) + '<div class="tx"><h3>' + b.n + '</h3><div class="k"><span>' + b.m + ' m</span><span>' + b.posti + ' posti</span><span>' + b.cv + ' cv</span><span class="' + (b.pat ? 'pat">Serve la patente' : '">Senza patente') + '</span>' + (b.sk === 2 ? '<span>Solo con skipper</span>' : '') + '</div><span class="pr">da ' + euro(b.p) + ' <small>al giorno</small></span></div></a></li>';
    }).join('') : '<li class="vuoto">Nessuna barca con questi filtri. Prova con meno persone o togli "senza patente".</li>';
  }
  function barca(id) {
    var b = byId(id) || B[1]; sel.barca = b.id;
    $('#b-box').innerHTML = (b.img ? '<img class="b-img" src="' + b.img + '" alt="' + b.alt + '" width="800" height="600">' : disegno(b)) + '<h1 id="b-nome">' + b.n + '</h1><p>' + b.desc + '</p>' +
      '<div class="spec"><div><b>' + b.m + ' m</b><small>lunghezza</small></div><div><b>' + b.posti + '</b><small>persone</small></div><div><b>' + b.cv + '</b><small>cavalli</small></div><div><b>' + (b.pat ? 'Sì' : 'No') + '</b><small>patente</small></div></div>' +
      '<p class="sez">Compreso nel prezzo</p><ul class="incl">' + b.inc.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ul>' +
      '<div class="sk-box"><div class="seg" role="group" aria-label="Skipper">' + (b.sk === 2 ? '<button type="button" aria-pressed="true" disabled>Skipper compreso</button><button type="button" disabled aria-pressed="false">Senza skipper</button>' : '<button type="button" data-bsk="no" aria-pressed="' + (sel.sk !== 'si') + '"' + (b.pat ? ' title="Serve la patente"' : '') + '>Guido io</button><button type="button" data-bsk="si" aria-pressed="' + (sel.sk === 'si') + '">Con skipper</button>') + '</div><p>' + (b.sk === 2 ? 'Su questa barca lo skipper è sempre a bordo.' : sel.sk === 'si' ? 'Lo skipper conosce le cale e prepara il pranzo: +' + euro(SKIPPER) + ' al giorno.' : b.pat ? 'Per guidarla serve la patente nautica: la chiediamo all\'imbarco.' : 'Nessuna patente: ti spieghiamo tutto prima di partire.') + '</p></div>' +
      '<div class="prezzi"><span><b>' + euro(b.p + (sel.sk === 'si' && b.sk === 1 ? SKIPPER : 0)) + '</b> <small>al giorno</small></span><a class="btn corallo" href="#/prenota/' + b.id + '">Scegli le date</a></div>';
  }
  function conto() {
    var b = byId(sel.barca), d = DUR.filter(function (x) { return x[0] === sel.dur; })[0], skip = b.sk === 2 ? 0 : sel.sk === 'si' ? SKIPPER * d[3] : 0;
    var ex = EXTRA.reduce(function (s, e) { return s + (sel.extra[e[0]] ? (e[4] ? e[3] * sel.pers : e[3]) : 0); }, 0);
    var tot = b.p * d[3] + skip + ex;
    return { b: b, d: d, skip: skip, ex: ex, tot: tot, cap: tot * 0.3 };
  }
  function prenota(id) {
    if (id && byId(id)) sel.barca = id;
    if (sel.md === 2) return conferma();
    var c = conto(), m = meteo(sel.g), b = c.b;
    $('#pr-box').innerHTML = '<p class="sez">Barca</p><div class="chips" role="group" aria-label="Barca">' + B.map(function (x) { return '<button type="button" data-pb="' + x.id + '" aria-pressed="' + (x.id === b.id) + '">' + x.n.replace('Barca a vela ', '').replace('Gommone ', '').replace('Catamarano ', '').replace('Open ', '') + '</button>'; }).join('') + '</div>' +
      '<p class="sez">Giorno</p><div class="giorni" role="group" aria-label="Giorno">' + giorniHtml('data-pg') + '</div>' +
      (m.v >= 19 ? '<p class="avviso">Il ' + giorno(sel.g).getDate() + ' è previsto ' + m.nome.toLowerCase() + ' a ' + m.v + ' nodi. Se il mare non permette di uscire, spostiamo la data o ti ridiamo la caparra.</p>' : '') +
      '<p class="sez">Durata</p><div class="dur" role="group" aria-label="Durata">' + DUR.map(function (x) { return '<button type="button" data-dur="' + x[0] + '" aria-pressed="' + (x[0] === sel.dur) + '"><span>' + x[1] + '<small>' + x[2] + '</small></span><b>' + euro(b.p * x[3]) + '</b></button>'; }).join('') + '</div>' +
      (b.sk === 1 ? '<p class="sez">Skipper</p><div class="seg" role="group" aria-label="Skipper"><button type="button" data-psk="no" aria-pressed="' + (sel.sk !== 'si') + '">Guido io</button><button type="button" data-psk="si" aria-pressed="' + (sel.sk === 'si') + '">Con skipper</button></div>' : '') +
      '<p class="sez">Extra</p><div class="extra">' + EXTRA.map(function (e) { return '<label><input type="checkbox" data-ex="' + e[0] + '"' + (sel.extra[e[0]] ? ' checked' : '') + '><span>' + e[1] + '<small>' + e[2] + '</small></span><b>' + (e[3] ? (e[4] ? e[3] + ' € a testa' : '+' + e[3] + ' €') : 'a consumo') + '</b></label>'; }).join('') + '</div>' +
      '<div class="conto" aria-live="polite"><p><span>' + b.n + ' · ' + c.d[1].toLowerCase() + '</span><span>' + euro(b.p * c.d[3]) + '</span></p>' + (c.skip ? '<p><span>Skipper</span><span>' + euro(c.skip) + '</span></p>' : '') + (c.ex ? '<p><span>Extra</span><span>' + euro(c.ex) + '</span></p>' : '') + '<p class="t"><span>Totale</span><span>' + euro(c.tot) + '</span></p><p><small>Caparra per bloccare la data: ' + euro(c.cap) + ' · il resto all\'imbarco' + (sel.extra.carb ? ' · carburante a parte' : '') + '</small></p></div>' +
      (b.pat && sel.sk !== 'si' && b.sk === 1 ? '<p class="avviso">Hai scelto di guidare tu: all\'imbarco ti chiediamo la patente nautica.</p>' : '') +
      '<button class="btn full" type="button" id="pr-ok">Blocca la data (demo)</button><p class="nota">Demo: nessun pagamento e nessun dato inviato. Nella versione vera la caparra si paga con carta e la barca resta tua per quel giorno.</p>';
  }
  function conferma() {
    var p = st.pren[0];
    $('#pr-box').innerHTML = '<div class="ok"><h2>Data bloccata.</h2><p><b>' + p.n + '</b></p><p>' + p.g + ' · ' + p.d + '</p><p>Totale ' + p.tot + ', caparra ' + p.cap + '</p><span class="cod">' + p.cod + '</span><p>Mostra questo codice al pontile 3, mezz\'ora prima della partenza. Porta crema solare e un documento.</p><button class="btn full" type="button" id="pr-nuova">Prenota un\'altra uscita</button></div>';
  }
  function meteoScr() {
    var g = '';
    for (var k = 1; k <= 7; k++) { var m = meteo(k), d = giorno(k); g += '<button type="button" data-mg="' + k + '" aria-pressed="' + (k === sel.g) + '"' + (m.v >= 19 ? ' class="forte"' : '') + '>' + GG[d.getDay()] + icona(m) + '<b>' + m.v + ' kn</b></button>'; }
    $('#me-giorni').innerHTML = g;
    var k2 = Math.min(sel.g, 7), m2 = meteo(k2), d2 = giorno(k2), mx = Math.max.apply(null, m2.ore);
    $('#me-box').innerHTML = '<div class="me-big">' + icona(m2) + '<span><small>' + GG[d2.getDay()] + ' ' + d2.getDate() + ' ' + MM[d2.getMonth()] + '</small><b>' + m2.v + ' nodi</b><small>' + m2.nome + ' da ' + m2.dir + ' · mare ' + m2.mare + ', onda ' + m2.onda + ' m · ' + m2.t + '°</small></span></div>' +
      '<div class="ore">' + ['9', '11', '13', '15', '17'].map(function (h, i) { return '<div>' + h + ':00<b>' + m2.ore[i] + '</b>nodi<i style="width:' + Math.round(m2.ore[i] / mx * 70) + '%"></i></div>'; }).join('') + '</div>' +
      '<p class="consiglio"><b>Il consiglio del porto.</b> ' + (m2.v < 9 ? 'Giornata da cale lontane: qualsiasi barca va bene.' : m2.v < 14 ? 'Si esce tranquilli. Con la vela si va benissimo.' : m2.v < 19 ? 'Meglio restare nelle cale riparate a est. Gommoni e gozzi solo la mattina.' : 'Vento forte: escono solo barche a vela e catamarano con skipper. Ti proponiamo un altro giorno.') + '</p>' +
      '<a class="btn full" href="#/flotta">Vedi le barche per questo giorno</a>';
  }
  var R = { home: home, flotta: flotta, barca: barca, prenota: prenota, meteo: meteoScr };
  function route() {
    var p = location.hash.replace(/^#\/?/, '').split('/'), n = R[p[0]] ? p[0] : 'home';
    $$('[data-screen]').forEach(function (s) { s.hidden = s.dataset.screen !== n; });
    var tab = n === 'barca' ? 'flotta' : n;
    $$('.tabbar a').forEach(function (a) { if (a.dataset.tab === tab) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    R[n](p[1]); window.scrollTo(0, 0); var sc = $('.app > main'); if (sc) sc.scrollTop = 0;
  }
  var mantieni = function (fn) { var sc = $('.app > main'), y = sc ? sc.scrollTop : 0, wy = window.scrollY; fn(); if (sc) sc.scrollTop = y; window.scrollTo(0, wy); };
  document.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b || b.disabled) return;
    if (b.dataset.g) { sel.g = +b.dataset.g; home(); }
    else if (b.dataset.pers) { sel.pers = Math.max(1, Math.min(10, sel.pers + +b.dataset.pers)); home(); }
    else if (b.dataset.sk) { sel.sk = sel.sk === b.dataset.sk ? 'tutti' : b.dataset.sk; home(); }
    else if (b.dataset.tipo) { sel.tipo = b.dataset.tipo; flotta(); }
    else if (b.dataset.bsk) { sel.sk = b.dataset.bsk; mantieni(function () { barca(sel.barca); }); }
    else if (b.dataset.pb) { sel.barca = b.dataset.pb; mantieni(prenota); }
    else if (b.dataset.pg) { sel.g = +b.dataset.pg; mantieni(prenota); }
    else if (b.dataset.dur) { sel.dur = b.dataset.dur; mantieni(prenota); }
    else if (b.dataset.psk) { sel.sk = b.dataset.psk; mantieni(prenota); }
    else if (b.dataset.mg) { sel.g = +b.dataset.mg; meteoScr(); }
    else if (b.id === 'pr-ok') {
      var c = conto(), d = giorno(sel.g);
      st.pren.unshift({ n: c.b.n, g: GG[d.getDay()] + ' ' + d.getDate() + ' ' + MM[d.getMonth()], d: c.d[1].toLowerCase() + ', ' + c.d[2], tot: euro(c.tot), cap: euro(c.cap), cod: 'LB-' + (d.getDate() * 37 + c.b.m * 10).toString(36).toUpperCase().slice(0, 4) });
      mem.set('stato', st); sel.md = 2; prenota(); var sc = $('.app > main'); if (sc) sc.scrollTop = 0; window.scrollTo(0, 0);
    }
    else if (b.id === 'pr-nuova') { sel.md = 1; prenota(); }
  });
  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.id === 'fl-pat') { sel.pat = t.checked; flotta(); }
    else if (t.dataset.ex) { sel.extra[t.dataset.ex] = t.checked; mantieni(prenota); }
  });
  window.addEventListener('hashchange', route);
  route();
})();
