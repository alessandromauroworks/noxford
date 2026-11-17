/* Passo Studio - app dimostrativa sopra il kit Noxford. Nessun dato viene inviato: le scelte restano in questo browser. */
(function () {
  'use strict';
  /* ---------- Guscio comune: stile A/B/C, tema, vetro, navigazione a schede ---------- */
  var d = document, esc = NX.esc;
  var $ = function (s, r) { return (r || d).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); };
  var I = {
    indietro: '<path d="M15 5l-7 7 7 7"/>',
    opzioni: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2.2"/><circle cx="9" cy="17" r="2.2"/>',
    piu: '<path d="M12 5v14M5 12h14"/>',
    meno: '<path d="M5 12h14"/>',
    ok: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    chev: '<path d="M9 5l7 7-7 7"/>',
    borsa: '<path d="M5 8h14l-1 12H6zM9 8V6a3 3 0 016 0v2"/>',
    cal: '<rect x="4" y="5" width="16" height="15" rx="3"/><path d="M4 10h16M9 3v4M15 3v4"/>',
    ora: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    pin: '<path d="M12 21s7-6.2 7-11.5A7 7 0 005 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    tel: '<path d="M5 4h3.5l1.5 4-2 1.5a11 11 0 005.5 5.5L15 13l4 1.5V18a2 2 0 01-2 2A14 14 0 013 6a2 2 0 012-2z"/>',
    giu: '<path d="M12 4v11M7 10.5l5 5 5-5M5 20h14"/>'
  };
  function ic(k) { return '<svg class="i" viewBox="0 0 24 24" aria-hidden="true">' + (I[k] || '') + '</svg>'; }
  var eur = function (n, dec) { return n.toLocaleString('it-IT', { minimumFractionDigits: dec === 0 ? 0 : 2, maximumFractionDigits: dec === 0 ? 0 : 2 }) + ' €'; };
  var G = { stile: 'a', v: null, par: null, cfg: null, pronto: false, temaUrl: false, chiave: 'x-' };
  var mem = {
    get: function (k, def) { try { var v = localStorage.getItem(G.chiave + k); return v ? JSON.parse(v) : def; } catch (e) { return def; } },
    set: function (k, v) { try { localStorage.setItem(G.chiave + k, JSON.stringify(v)); } catch (e) {} }
  };
  /* porta al centro il pulsante scelto di una fila orizzontale, senza far scorrere la pagina */
  function centra(box) { if (!box) return; var b = box.querySelector('[aria-pressed="true"]'); if (b) box.scrollLeft = Math.max(0, b.offsetLeft - box.clientWidth / 2 + b.offsetWidth / 2); }
  var ridotto = function () { return window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches; };

  /* parametri dell'indirizzo: valgono per questa visita e non vengono salvati */
  var q = new URLSearchParams(location.search);
  if (/^[abc]$/.test(q.get('stile') || '')) G.stile = q.get('stile');
  NX.pref.init();
  if (q.get('tema')) { NX.pref.tema(q.get('tema'), { salva: false }); G.temaUrl = true; }
  if (q.get('vetro')) { NX.pref.vetro(q.get('vetro') !== 'no', { salva: false }); G.temaUrl = true; }

  function scriviUrl() {
    var p = new URLSearchParams(location.search);
    p.set('stile', G.stile);
    if (G.temaUrl) { p.set('tema', NX.pref.temaAttivo()); p.set('vetro', NX.pref.vetroAttivo() ? 'si' : 'no'); }
    try { history.replaceState(null, '', location.pathname + '?' + p.toString() + location.hash); } catch (e) {}
  }
  d.addEventListener('nx:pref', function () { if (G.pronto) { G.temaUrl = true; scriviUrl(); } });

  function descStile() { var s = G.cfg.stili[G.stile]; $$('.x-stile-d').forEach(function (p) { p.textContent = s[1]; }); }
  function segStile(box) {
    box.innerHTML = ['a', 'b', 'c'].map(function (k) { return '<button type="button" data-v="' + k + '" aria-pressed="' + (k === G.stile) + '"><span class="nx-sr">Stile ' + k.toUpperCase() + ': </span>' + G.cfg.stili[k][0] + '</button>'; }).join('');
    box._api = NX.seg(box, function (v) { G.cambiaStile(v); });
  }
  G.cambiaStile = function (s) {
    if (s === G.stile) return;
    G.stile = s; d.body.setAttribute('data-stile', s);
    $$('.x-seg-stile').forEach(function (b) { if (b._api) b._api.scegli(s); });
    descStile(); scriviUrl(); mostra(true, true);
  };
  function rigaToggle(t, cl) { return '<li><label class="nx-cella x-tg"><span class="nx-c-tx"><b>' + t + '</b></span><span class="nx-toggle"><input type="checkbox" class="' + cl + '"><i></i></span></label></li>'; }
  G.opzioni = function () {
    var f = NX.foglio.apri({
      titolo: 'Opzioni',
      html: '<div class="nx-campo"><span>Stile dell\'app</span><div class="nx-seg pieno x-seg-stile" role="group" aria-label="Stile dell\'app"></div><small class="x-stile-d"></small></div>' +
        '<ul class="nx-lista">' + rigaToggle('Tema scuro', 'x-f-t') + rigaToggle('Effetto vetro', 'x-f-v') + '</ul>' +
        '<p class="x-f-nota">' + G.cfg.nota + '</p>'
    });
    segStile(f.querySelector('.x-seg-stile')); descStile();
    NX.pref.collega(f.querySelector('.x-f-t'), 'tema'); NX.pref.collega(f.querySelector('.x-f-v'), 'vetro');
  };

  function schede() { return G.cfg.viste.filter(function (v) { return v.tab; }); }
  function trova(id) { var v = null; G.cfg.viste.forEach(function (x) { if (x.id === id) v = x; }); return v || G.cfg.viste[0]; }
  function indice(v) { if (!v) return -1; var t = schede(), id = v.di || v.id; for (var i = 0; i < t.length; i++) if (t[i].id === id) return i; return -1; }
  function costruisci() {
    var c = G.cfg, t = schede();
    $('#x-tab').innerHTML = t.map(function (v) { return '<a href="#/' + v.id + '" data-v="' + v.id + '">' + ic(v.ic) + '<span>' + v.nome + '</span><b class="x-badge" data-badge="' + v.id + '" hidden></b></a>'; }).join('');
    $('#x-lato').innerHTML = '<div class="x-lato-brand">' + c.logo + '<span><b>' + c.nome + '</b><small>' + c.sotto + '</small></span></div>' +
      '<ul class="nx-lista x-lato-nav">' + t.map(function (v) { return '<li><a class="nx-cella ic" href="#/' + v.id + '" data-v="' + v.id + '"><span class="nx-c-ic">' + ic(v.ic) + '</span><span class="nx-c-tx"><b>' + v.nome + '</b></span><b class="x-badge" data-badge="' + v.id + '" hidden></b></a></li>'; }).join('') + '</ul>' +
      '<p class="nx-gruppo-t">Stile dell\'app</p><div class="nx-seg pieno x-seg-stile" role="group" aria-label="Stile dell\'app"></div><p class="x-stile-d x-lato-d"></p>' +
      '<ul class="nx-lista">' + rigaToggle('Tema scuro', 'x-l-t') + rigaToggle('Effetto vetro', 'x-l-v') + '</ul>' +
      '<p class="x-lato-nota">' + c.descr + '</p>';
    segStile($('#x-lato .x-seg-stile'));
    NX.pref.collega($('#x-lato .x-l-t'), 'tema'); NX.pref.collega($('#x-lato .x-l-v'), 'vetro');
    $('#x-nb-dx').innerHTML = (c.destra ? '<span id="x-dx-app"></span>' : '') + '<button type="button" class="nx-btn ico t x-solo-stretto" id="x-opz" aria-label="Opzioni: stile, tema e vetro">' + ic('opzioni') + '</button>';
    $('#x-opz').addEventListener('click', G.opzioni);
    descStile();
  }
  G.badge = function (id, n) {
    $$('[data-badge="' + id + '"]').forEach(function (b) {
      var prima = b.textContent; b.textContent = n || ''; b.hidden = !n;
      if (n && prima !== String(n)) { b.classList.remove('nx-scala'); void b.offsetWidth; b.classList.add('nx-scala'); }
    });
  };
  G.destra = function () { var s = $('#x-dx-app'); if (s && G.cfg.destra) s.innerHTML = G.cfg.destra(); };

  function leggiHash() { var p = (location.hash || '').replace(/^#\/?/, '').split('/'); return { id: p[0], par: p[1] ? decodeURIComponent(p[1]) : null }; }
  function mostra(anim, stessa) {
    var h = leggiHash(), v = trova(h.id), prima = G.v;
    G.v = v; G.par = h.par;
    var tit = typeof v.titolo === 'function' ? v.titolo(h.par) : (v.titolo || v.nome);
    var html = v.render(h.par), box = $('#x-vista');
    var verso = stessa ? '' : (v.di && (!prima || prima.id !== v.id) ? 'dx' : (prima && prima.di === v.id ? 'sx' : (indice(v) >= indice(prima) ? 'dx' : 'sx')));
    if (anim && !ridotto()) NX.vista(box, html, verso); else box.innerHTML = html;
    $('#x-tit').textContent = tit; $('#x-pic').textContent = v.corto || tit;
    $('#x-tit').hidden = !!(v.senzaTitolo && v.senzaTitolo(G.stile));
    d.body.classList.toggle('x-senza-tit', $('#x-tit').hidden);
    var sx = $('#x-nb-sx');
    sx.innerHTML = v.indietro ? '<a class="nx-btn t x-indietro" href="' + v.indietro[0] + '">' + ic('indietro') + '<span>' + v.indietro[1] + '</span></a>' : '';
    var tab = v.di || v.id;
    $$('#x-tab a, .x-lato-nav a').forEach(function (a) { if (a.getAttribute('data-v') === tab) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    d.title = tit + ' · ' + G.cfg.nome + ' (app dimostrativa)';
    if (v.dopo) v.dopo(h.par);
    G.destra();
  }
  /* ridisegna la vista corrente senza animazione, tenendo la posizione */
  G.aggiorna = function () {
    var y = window.scrollY, v = G.v;
    $('#x-vista').innerHTML = v.render(G.par);
    if (v.dopo) v.dopo(G.par);
    G.destra();
    window.scrollTo(0, y);
  };
  G.vai = function (h) { if (location.hash === h) mostra(true); else location.hash = h; };

  G.avvia = function (cfg) {
    G.cfg = cfg;
    d.body.setAttribute('data-stile', G.stile);
    costruisci();
    mostra(false);
    var nav = $('#x-nav'), su = null;
    function scorri() { var giu = window.scrollY > 30; if (giu !== su) { su = giu; nav.classList.toggle('nx-compatta', giu); nav.classList.toggle('nx-vetro', giu); } }
    window.addEventListener('scroll', scorri, { passive: true }); scorri();
    window.addEventListener('hashchange', function () { NX.foglio.chiudi(); mostra(true); window.scrollTo(0, 0); });
    d.addEventListener('click', function (e) { var a = e.target.closest('[data-nx-azione]'); if (a && cfg.azione) cfg.azione(a.getAttribute('data-nx-azione'), a); });
    G.pronto = true;
    scriviUrl();
  };

  /* ---------- Passo Studio, sneakers su misura ---------- */
  G.chiave = 'passo2-';
  I.studio = '<path d="M3 17h18v3H3zM4 17l1-6h6l3 3h5l2 3"/>';
  I.modelli = '<rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/>';
  I.crea = '<path d="M4 20l4-1 11-11-3-3L5 16z"/><path d="M14 6l3 3"/>';

  var MOD = [
    { id: 'basso', n: 'Basso', d: 'La classica da tutti i giorni, profilo pulito.', p: 139 },
    { id: 'alto', n: 'Alto', d: 'Copre la caviglia, imbottitura in più.', p: 159 },
    { id: 'runner', n: 'Runner', d: 'Suola alta e morbida, per camminare tanto.', p: 149 }
  ];
  var PARTI = [['tomaia', 'Tomaia'], ['punta', 'Punta'], ['tallone', 'Tallone'], ['lacci', 'Lacci'], ['suola', 'Suola']];
  var COL = [['#F4F1EA', 'panna'], ['#111111', 'nero'], ['#2F4BFF', 'blu elettrico'], ['#C8553D', 'mattone'], ['#5F7A4F', 'salvia'], ['#D9B44A', 'senape'], ['#E8A5B5', 'rosa cipria'], ['#7A5135', 'cuoio'], ['#9AA3AD', 'grigio'], ['#1F3A5F', 'blu notte'], ['#B23A48', 'bordeaux'], ['#FFFFFF', 'bianco']];
  var SCURI = ['#111111', '#1F3A5F', '#2F4BFF', '#B23A48', '#7A5135', '#C8553D', '#5F7A4F'];
  var MAT = [['pelle', 'Pelle liscia', 0, 'si pulisce con un panno'], ['camoscio', 'Scamosciato', 15, 'morbido, colore più profondo'], ['tela', 'Tela di cotone', -10, 'leggera, per la bella stagione']];
  var TG = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47];
  var BASE = { mod: 'basso', col: { tomaia: '#F4F1EA', punta: '#F4F1EA', tallone: '#2F4BFF', lacci: '#F4F1EA', suola: '#FFFFFF' }, mat: 'pelle', ini: '', tg: null };
  var copia = function (o) { return JSON.parse(JSON.stringify(o)); };
  var conf = mem.get('conf', copia(BASE));
  var parte = 'tomaia', vista = 'lato';
  var st = mem.get('stato', { borsa: [], ord: null, sped: 'casa' });
  var mod = function (id) { return MOD.filter(function (m) { return m.id === id; })[0] || MOD[0]; };
  var matr = function (id) { return MAT.filter(function (m) { return m[0] === id; })[0] || MAT[0]; };
  var nomeCol = function (h) { var c = COL.filter(function (x) { return x[0] === h; })[0]; return c ? c[1] : h; };
  var prezzo = function (c) { return mod(c.mod).p + matr(c.mat)[2] + (c.ini ? 10 : 0); };
  var salvaConf = function () { mem.set('conf', conf); };
  var salva = function () { mem.set('stato', st); G.badge('borsa', st.borsa.length); G.destra(); };
  var totBorsa = function () { return st.borsa.reduce(function (s, x) { return s + prezzo(x); }, 0); };
  var sped = function () { return st.sped === 'casa' && totBorsa() < 150 ? 8 : 0; };
  var uid = 0;

  /* disegno della scarpa: ogni parte prende il suo colore, il materiale cambia la trama */
  function scarpa(c, v, piccola) {
    var k = 'ps' + (uid++), m = c.mod, col = c.col, alto = m === 'alto', run = m === 'runner';
    var trama = c.mat === 'camoscio' ? '<pattern id="' + k + 't" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".7" fill="#000" opacity=".12"/><circle cx="3.5" cy="3.5" r=".6" fill="#fff" opacity=".12"/></pattern>'
      : c.mat === 'tela' ? '<pattern id="' + k + 't" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M0 0h4M0 2h4" stroke="#000" stroke-width=".5" opacity=".12"/></pattern>'
      : '<linearGradient id="' + k + 't" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".25"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/></linearGradient>';
    var lbl = 'Anteprima: modello ' + mod(m).n + ', tomaia ' + nomeCol(col.tomaia) + ' in ' + matr(c.mat)[1].toLowerCase() + ', tallone ' + nomeCol(col.tallone) + (c.ini ? ', iniziali ' + c.ini : '');
    var inkT = SCURI.indexOf(col.tallone) >= 0 ? '#F4F1EA' : '#111';
    if (v === 'retro') {
      var y1 = alto ? 30 : 60, y0 = alto ? 10 : 40, y2 = alto ? 22 : 52, y3 = alto ? 14 : 44;
      var corpo = 'M120 ' + y1 + ' Q180 ' + y0 + ' 240 ' + y1 + ' L250 165 L110 165 Z';
      return '<svg class="p-scarpa" viewBox="0 0 360 200" role="img" aria-label="' + lbl + ', vista dal tallone"><defs>' + trama + '</defs>' +
        '<ellipse cx="180" cy="186" rx="96" ry="7" fill="#000" opacity=".08"/><path d="' + corpo + '" fill="' + col.tomaia + '" stroke="#111" stroke-width="1.5"/><path d="' + corpo + '" fill="url(#' + k + 't)"/>' +
        '<path d="M152 ' + y2 + ' Q180 ' + y3 + ' 208 ' + y2 + ' L214 165 L146 165 Z" fill="' + col.tallone + '" stroke="#111" stroke-width="1.5"/>' +
        '<text x="180" y="125" text-anchor="middle" font-family="Manrope, sans-serif" font-weight="600" font-size="' + (c.ini ? 28 : 11) + '" letter-spacing="' + (c.ini ? 4 : 0) + '" fill="' + inkT + '">' + (c.ini || 'iniziali qui') + '</text>' +
        '<rect x="104" y="' + (run ? 158 : 163) + '" width="152" height="' + (run ? 26 : 18) + '" rx="6" fill="' + col.suola + '" stroke="#111" stroke-width="1.5"/></svg>';
    }
    var top = alto ? 'M42 142 L42 58 Q44 22 92 20 L140 24 Q166 42 196 42' : 'M42 142 L46 98 Q52 68 92 64 L148 60 Q168 40 198 40';
    var tomaia = top + ' L238 42 Q262 46 272 70 Q302 92 330 112 Q344 124 338 142 Z';
    var tallone = alto ? 'M42 142 L42 58 Q44 22 88 20 L94 142 Z' : 'M42 142 L46 98 Q52 70 82 66 L88 142 Z';
    var sy = run ? 132 : 142, lacci = '';
    for (var i = 0; i < 5; i++) { var x = 172 + i * 18, y = 46 + i * 9; lacci += '<path d="M' + (x - 8) + ' ' + (y - 2) + 'l16 6" stroke="' + col.lacci + '" stroke-width="' + (piccola ? 4 : 3.2) + '" stroke-linecap="round"/><path d="M' + (x - 8) + ' ' + (y - 2) + 'l16 6" stroke="#111" stroke-width=".6" stroke-linecap="round" opacity=".4"/>'; }
    return '<svg class="p-scarpa" viewBox="0 0 360 200" role="img" aria-label="' + lbl + ', vista di lato"><defs>' + trama + '</defs>' +
      '<ellipse cx="185" cy="184" rx="150" ry="7" fill="#000" opacity=".08"/>' +
      '<path d="' + tomaia + '" fill="' + col.tomaia + '" stroke="#111" stroke-width="1.5"/><path d="' + tomaia + '" fill="url(#' + k + 't)"/>' +
      '<path d="M286 96 Q320 106 336 124 Q342 134 338 142 L280 142 Q274 116 286 96 Z" fill="' + col.punta + '" stroke="#111" stroke-width="1.5"/>' +
      '<path d="' + tallone + '" fill="' + col.tallone + '" stroke="#111" stroke-width="1.5"/>' +
      (c.ini && !piccola ? '<text x="65" y="' + (alto ? 96 : 118) + '" text-anchor="middle" font-family="Manrope, sans-serif" font-weight="600" font-size="11" letter-spacing="1" fill="' + inkT + '">' + c.ini + '</text>' : '') +
      '<path d="M150 68 Q200 56 250 74" fill="none" stroke="#111" stroke-width="1" stroke-dasharray="3 3" opacity=".5"/>' + lacci +
      '<path d="M30 ' + sy + ' L340 ' + sy + ' L340 ' + (sy + 8) + ' Q342 170 320 172 L50 172 Q28 170 30 ' + (sy + 8) + ' Z" fill="' + col.suola + '" stroke="#111" stroke-width="1.5"/>' +
      (run ? '<path d="M40 152 Q120 144 200 154 T336 150" fill="none" stroke="#111" stroke-width="1.2" opacity=".5"/>' : '<path d="M34 160h302" stroke="#111" stroke-width=".8" opacity=".35"/>') + '</svg>';
  }
  var COME = [['Scegli il modello', 'Basso, alto o runner.'], ['Colora ogni parte', 'Tomaia, punta, tallone, lacci e suola, anche tutti diversi.'], ['Aggiungi le iniziali', 'Stampate a caldo sul tallone.'], ['La cuciamo in 10 giorni', 'In laboratorio, dietro al negozio.']];

  /* --- Studio (home) --- */
  function vHome() {
    var s = G.stile;
    var negozio = '<div class="p-neg"><img src="img/negozio.webp" width="896" height="1200" alt="Il negozio: mensola lunga in rovere con sneakers in vari colori e una pianta" loading="lazy"><div><b>Vieni a provarle</b><p>In negozio trovi tutti i colori dal vero e la prova delle taglie. Dal martedì al sabato, 10–19:30.</p></div></div>';
    if (s === 'b') {
      return '<h2 class="p-big">Le tue sneakers. <em>Le disegni tu, le cuciamo noi.</em></h2>' +
        '<figure class="p-hero"><img src="img/banco.webp" width="1200" height="896" alt="Banco di lavoro artigianale con ritagli di pelle colorata, rocchetti di filo, cartamodelli e una sneaker bianca senza marchi" fetchpriority="high"></figure>' +
        '<a class="nx-btn p pieno p-cta" href="#/crea">Inizia a crearla</a>' +
        '<ol class="p-passi-b">' + COME.map(function (x, i) { return '<li><span class="nx-num">0' + (i + 1) + '</span><b>' + x[0] + '</b><p>' + x[1] + '</p></li>'; }).join('') + '</ol>' +
        '<figure class="p-neg-b"><img src="img/negozio.webp" width="896" height="1200" alt="Il negozio: mensola lunga in rovere con sneakers in vari colori e una pianta" loading="lazy"><figcaption><b>Vieni a provarle</b><span>Tutti i colori dal vero e la prova delle taglie. Martedì–sabato, 10–19:30.</span></figcaption></figure>';
    }
    if (s === 'c') {
      return '<a class="p-riprendi" href="#/crea" data-nx-premi><span class="p-stage">' + scarpa(conf, 'lato', true) + '</span><span class="p-riprendi-t"><small>La tua in corso</small><b>' + mod(conf.mod).n + ' · ' + matr(conf.mat)[1].toLowerCase() + '</b><em class="nx-num">' + prezzo(conf) + ' €</em></span>' + ic('chev') + '</a>' +
        '<h2 class="x-h2">Parti da un modello</h2><div class="p-mini">' + MOD.map(function (m) { var c = copia(conf); c.mod = m.id; c.ini = ''; return '<a href="#/crea/' + m.id + '" data-nx-premi><span class="p-stage">' + scarpa(c, 'lato', true) + '</span><b>' + m.n + '</b><small class="nx-num">da ' + m.p + ' €</small></a>'; }).join('') + '</div>' +
        '<ul class="nx-lista" style="margin-top:24px">' + COME.map(function (x, i) { return '<li><div class="nx-cella"><span class="p-n nx-num">' + (i + 1) + '</span><span class="nx-c-tx"><b>' + x[0] + '</b><small class="w">' + x[1] + '</small></span></div></li>'; }).join('') + '</ul>' +
        '<div style="margin-top:20px">' + negozio + '</div>';
    }
    return '<p class="x-sotto">Le disegni tu, le cuciamo noi in laboratorio.</p>' +
      '<figure class="x-foto"><img src="img/banco.webp" width="1200" height="896" alt="Banco di lavoro artigianale con ritagli di pelle colorata, rocchetti di filo, cartamodelli e una sneaker bianca senza marchi" fetchpriority="high"></figure>' +
      '<a class="nx-btn p pieno p-cta" href="#/crea">Inizia a crearla</a>' +
      '<p class="nx-gruppo-t">Come funziona</p><div class="nx-gruppo"><ul class="nx-lista">' + COME.map(function (x, i) { return '<li><div class="nx-cella"><span class="p-n nx-num">' + (i + 1) + '</span><span class="nx-c-tx"><b>' + x[0] + '</b><small class="w">' + x[1] + '</small></span></div></li>'; }).join('') + '</ul></div>' + negozio;
  }

  /* --- Modelli --- */
  function vModelli() {
    var s = G.stile;
    return '<ul class="p-modelli ' + s + '">' + MOD.map(function (m) {
      var c = copia(conf); c.mod = m.id; c.ini = '';
      return '<li><a href="#/crea/' + m.id + '" data-nx-premi><span class="p-stage">' + scarpa(c, 'lato', true) + '</span><span class="p-mod-t"><b>' + m.n + '</b><small>' + m.d + '</small><em class="nx-num">da ' + m.p + ' €</em></span>' + (s === 'a' ? '<i class="nx-chev"></i>' : '') + '</a></li>';
    }).join('') + '</ul><p class="x-nota">Le anteprime usano i colori che hai scelto nel configuratore.</p>';
  }

  /* --- Crea --- */
  function riepilogo() {
    var m = mod(conf.mod), mt = matr(conf.mat);
    return '<div class="x-righe"><p><span>Modello ' + m.n.toLowerCase() + '</span><span>' + m.p + ' €</span></p>' + (mt[2] ? '<p><span>' + mt[1] + '</span><span>' + (mt[2] > 0 ? '+' : '') + mt[2] + ' €</span></p>' : '') + (conf.ini ? '<p><span>Iniziali ' + conf.ini + '</span><span>+10 €</span></p>' : '') + '<p class="t"><span>Totale</span><span>' + prezzo(conf) + ' €</span></p></div>';
  }
  function vCrea(id) {
    if (id && MOD.some(function (m) { return m.id === id; }) && conf.mod !== id) { conf.mod = id; if (conf.mod === 'alto' && conf.tg === 36) conf.tg = null; salvaConf(); }
    var s = G.stile, m = mod(conf.mod), mt = matr(conf.mat);
    var lab = function (n, t, extra) { return s === 'b' ? '<h3 class="p-sez"><span class="nx-num">0' + n + '</span>' + t + (extra ? '<small>' + extra + '</small>' : '') + '</h3>' : '<p class="x-lab">' + t + (extra ? ' <span class="x-mini">· ' + extra + '</span>' : '') + '</p>'; };
    var ant = '<div class="p-ant" id="p-ant"><div class="p-stage">' + scarpa(conf, vista) + '</div><div class="p-ant-r"><span>' + m.n + ' · ' + mt[1].toLowerCase() + '</span><b class="nx-num" id="p-prezzo">' + prezzo(conf) + ' €</b></div>' +
      '<div class="nx-seg p-vista" role="group" aria-label="Vista"><button type="button" data-v="lato" aria-pressed="' + (vista === 'lato') + '">Di lato</button><button type="button" data-v="retro" aria-pressed="' + (vista === 'retro') + '">Tallone</button></div></div>';
    var modelli = '<div class="nx-seg pieno p-mod" role="group" aria-label="Modello">' + MOD.map(function (x) { return '<button type="button" data-v="' + x.id + '" aria-pressed="' + (x.id === conf.mod) + '">' + x.n + '</button>'; }).join('') + '</div>';
    var parti = '<div class="nx-chips p-parti" role="group" aria-label="Parte da colorare">' + PARTI.map(function (p) { return '<button type="button" class="nx-chip" data-parte="' + p[0] + '" aria-pressed="' + (p[0] === parte) + '"><i style="background:' + conf.col[p[0]] + '"></i>' + p[1] + '</button>'; }).join('') + '</div>';
    var colori = '<div class="p-col" role="group" aria-label="Colore della ' + parte + '">' + COL.map(function (c) { return '<button type="button" data-col="' + c[0] + '" aria-pressed="' + (conf.col[parte] === c[0]) + '" aria-label="' + c[1] + '" title="' + c[1] + '" style="--c:' + c[0] + '"></button>'; }).join('') + '</div><p class="x-mini p-col-n">' + PARTI.filter(function (p) { return p[0] === parte; })[0][1] + ': <b>' + nomeCol(conf.col[parte]) + '</b></p>';
    var mat = s === 'c' ? '<div class="nx-seg pieno p-mat-seg" role="group" aria-label="Materiale">' + MAT.map(function (x) { return '<button type="button" data-v="' + x[0] + '" aria-pressed="' + (x[0] === conf.mat) + '">' + x[1].split(' ')[0] + '</button>'; }).join('') + '</div>'
      : '<ul class="nx-lista p-mat">' + MAT.map(function (x) { return '<li><button type="button" class="nx-cella" data-mat="' + x[0] + '" aria-pressed="' + (x[0] === conf.mat) + '"><span class="p-radio" aria-hidden="true"></span><span class="nx-c-tx"><b>' + x[1] + '</b><small>' + x[3] + '</small></span><span class="nx-c-dx nx-num">' + (x[2] > 0 ? '+' + x[2] + ' €' : x[2] < 0 ? x[2] + ' €' : 'compreso') + '</span></button></li>'; }).join('') + '</ul>';
    var ini = '<label class="nx-campo p-ini"><span class="nx-sr">Iniziali sul tallone</span><input id="p-ini" maxlength="3" autocomplete="off" autocapitalize="characters" placeholder="Es. GLR" value="' + esc(conf.ini) + '"></label>';
    var taglie = '<div class="p-tg" role="group" aria-label="Taglia">' + TG.map(function (t) { var no = conf.mod === 'alto' && t === 36; return '<button type="button" data-tg="' + t + '" aria-pressed="' + (conf.tg === t) + '"' + (no ? ' disabled aria-label="' + t + ', non disponibile per questo modello"' : '') + '>' + t + '</button>'; }).join('') + '</div>';
    var fine = '<div class="x-card p-fine">' + riepilogo() + '<p class="x-err" id="p-err" role="alert"></p><button class="nx-btn p pieno" type="button" id="p-add" style="margin-top:14px">' + ic('borsa') + 'Metti nella borsa · ' + prezzo(conf) + ' €</button><button class="nx-btn t pieno" type="button" data-a="reset" style="margin-top:6px">Ricomincia da capo</button></div>';
    if (s === 'c') {
      return '<div class="p-c">' + ant + '<div class="p-c-ctrl">' + modelli + '<p class="x-lab">Parte</p>' + parti + colori + '<p class="x-lab">Materiale</p>' + mat +
        '<div class="p-c-due"><div><p class="x-lab">Iniziali <span class="x-mini">+10 €</span></p>' + ini + '</div></div><p class="x-lab">Taglia EU</p>' + taglie + '</div></div>' + fine;
    }
    return ant + lab(1, 'Modello') + modelli + lab(2, 'Colori', 'una parte alla volta') + parti + colori + lab(3, 'Materiale della tomaia') + mat + lab(4, 'Iniziali sul tallone', 'fino a 3 lettere, +10 €') + ini + lab(5, 'Taglia EU', conf.mod === 'alto' ? 'il modello alto parte dal 37' : '') + taglie + '<div style="height:20px"></div>' + fine;
  }

  /* --- Borsa --- */
  function vBorsa() {
    if (st.ord) return '<div class="x-card x-ok"><span class="x-ok-ic">' + ic('ok') + '</span><h2>Ordine ricevuto</h2><p>Codice ordine</p><span class="x-num p-cod">' + st.ord.cod + '</span><p>' + st.ord.n + (st.ord.n === 1 ? ' paio' : ' paia') + ', totale ' + st.ord.tot + ' €.</p>' +
      '<ol class="p-tempi"><li><b>Oggi</b>controlliamo i colori e ti scriviamo se manca qualcosa.</li><li><b>Tra 2 giorni</b>tagliamo la pelle.</li><li><b>Entro 10 giorni lavorativi</b>' + (st.ord.sped === 'casa' ? 'parte il pacco.' : 'la trovi in negozio.') + '</li></ol>' +
      '<button class="nx-btn p" type="button" data-a="nuovo">Crea un altro paio</button><p class="x-nota">Demo: nessun pagamento e nessun dato inviato.</p></div>';
    if (!st.borsa.length) return NX.stato.vuoto('La borsa è vuota', 'Disegna la tua sneaker: colori, materiale e iniziali. La trovi qui quando la metti nella borsa.', ['Crea la tua', 'crea']);
    var tot = totBorsa(), sp = sped();
    return '<ul class="p-borsa">' + st.borsa.map(function (x, i) {
      return '<li class="x-card"><span class="p-stage">' + scarpa(x, 'lato', true) + '</span><div><b>' + mod(x.mod).n + ' · taglia ' + x.tg + '</b><small>Tomaia ' + nomeCol(x.col.tomaia) + ' in ' + matr(x.mat)[1].toLowerCase() + ', tallone ' + nomeCol(x.col.tallone) + ', suola ' + nomeCol(x.col.suola) + (x.ini ? ', iniziali ' + x.ini : '') + '</small><div class="p-borsa-r"><em class="nx-num">' + prezzo(x) + ' €</em><button type="button" class="nx-btn t r" data-togli="' + i + '">Togli</button></div></div></li>';
    }).join('') + '</ul>' +
      '<p class="x-lab">Consegna</p><div class="nx-seg pieno p-sped" role="group" aria-label="Consegna"><button type="button" data-v="casa" aria-pressed="' + (st.sped === 'casa') + '">A casa · ' + (tot >= 150 ? 'gratis' : '8 €') + '</button><button type="button" data-v="negozio" aria-pressed="' + (st.sped === 'negozio') + '">In negozio · gratis</button></div>' +
      '<p class="x-nota">Spedizione gratis da 150 €. Ogni paio è cucito per te: pronto in 10 giorni lavorativi. Se la taglia non va, la rifacciamo una volta senza costi.</p>' +
      '<div class="x-card" style="margin-top:16px"><div class="x-righe"><p><span>Sneakers</span><span>' + tot + ' €</span></p><p><span>Consegna</span><span>' + (sp ? sp + ' €' : 'gratis') + '</span></p><p class="t"><span>Totale</span><span>' + (tot + sp) + ' €</span></p></div>' +
      '<button class="nx-btn p pieno" type="button" id="p-ordina" style="margin-top:16px">Ordina · ' + (tot + sp) + ' €</button></div><p class="x-nota">Demo: nessun pagamento e nessun dato inviato.</p>';
  }

  /* --- eventi --- */
  function ridisegnaAnteprima() {
    var a = $('#p-ant .p-stage'); if (a) a.innerHTML = scarpa(conf, vista);
    var pr = $('#p-prezzo'); if (pr) { pr.textContent = prezzo(conf) + ' €'; pr.classList.remove('nx-scala'); void pr.offsetWidth; pr.classList.add('nx-scala'); }
  }
  d.addEventListener('input', function (e) {
    if (e.target.id !== 'p-ini') return;
    var v = e.target.value.toUpperCase().replace(/[^A-ZÀ-Ù]/g, '').slice(0, 3);
    if (e.target.value !== v) e.target.value = v;
    conf.ini = v; salvaConf(); ridisegnaAnteprima();
    var f = $('.p-fine .x-righe'); if (f) f.outerHTML = riepilogo();
    var b = $('#p-add'); if (b) b.innerHTML = ic('borsa') + 'Metti nella borsa · ' + prezzo(conf) + ' €';
  });
  d.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b || b.disabled) return;
    var a = b.getAttribute('data-a');
    if (b.dataset.parte) { parte = b.dataset.parte; G.aggiorna(); }
    else if (b.dataset.col) { conf.col[parte] = b.dataset.col; salvaConf(); G.aggiorna(); }
    else if (b.dataset.mat) { conf.mat = b.dataset.mat; salvaConf(); G.aggiorna(); }
    else if (b.dataset.tg) { conf.tg = +b.dataset.tg; salvaConf(); G.aggiorna(); }
    else if (b.id === 'p-add') {
      if (!conf.tg) { $('#p-err').textContent = 'Scegli la taglia qui sopra.'; var t = $('.p-tg'); if (t) t.scrollIntoView({ behavior: ridotto() ? 'auto' : 'smooth', block: 'center' }); return; }
      st.borsa.push(copia(conf)); st.ord = null; salva(); NX.toast('Nella borsa: ' + mod(conf.mod).n.toLowerCase() + ', taglia ' + conf.tg + '.'); G.vai('#/borsa');
    }
    else if (a === 'reset') { conf = copia(BASE); parte = 'tomaia'; salvaConf(); G.aggiorna(); NX.toast('Configurazione azzerata.', 'info'); }
    else if (b.dataset.togli) { st.borsa.splice(+b.dataset.togli, 1); salva(); G.aggiorna(); NX.toast('Tolta dalla borsa.', 'info'); }
    else if (b.id === 'p-ordina') {
      var tot = totBorsa(), sp = sped();
      st.ord = { cod: 'PS-' + (1000 + (tot * 7 + new Date().getMinutes()) % 9000), n: st.borsa.length, tot: tot + sp, sped: st.sped };
      st.borsa = []; salva(); window.scrollTo(0, 0); G.aggiorna(); NX.toast('Ordine ricevuto.');
    }
    else if (a === 'nuovo') { st.ord = null; salva(); G.vai('#/crea'); }
  });

  function segCrea() {
    var v = $('#x-vista .p-vista'); if (v) NX.seg(v, function (x) { vista = x; ridisegnaAnteprima(); });
    var m = $('#x-vista .p-mod'); if (m) NX.seg(m, function (x) { conf.mod = x; if (x === 'alto' && conf.tg === 36) conf.tg = null; salvaConf(); try { history.replaceState(null, '', location.pathname + location.search + '#/crea/' + x); } catch (er) {} G.par = x; G.aggiorna(); });
    var t = $('#x-vista .p-mat-seg'); if (t) NX.seg(t, function (x) { conf.mat = x; salvaConf(); G.aggiorna(); });
    centra($('#x-vista .p-parti'));
  }
  G.avvia({
    nome: 'Passo Studio', sotto: 'sneakers su misura',
    logo: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect width="48" height="48" rx="14" fill="#111"/><path d="M8 31h32v5H8zM9 31l1.5-10h11l4.5 4.5h9L39 31" fill="#F5F5F2"/><circle cx="36" cy="13" r="4" fill="#2F4BFF"/></svg>',
    stili: { a: ['Classico', 'Liste e controlli di sistema: il configuratore passo per passo, con l\'anteprima in alto.'], b: ['Vetrina', 'Come una rivista: titoli grandi, foto del laboratorio, i cinque passi numerati.'], c: ['Banco', 'Tutto in una schermata: anteprima fissa accanto ai controlli, colori e taglie fitti.'] },
    nota: 'Attività inventata, modelli e prezzi di esempio. La sneaker e la borsa restano solo in questo browser.',
    descr: 'App di un negozio di sneakers su misura inventato: configuratore con anteprima che cambia mentre scegli, borsa e ordine con i tempi di lavorazione. Tutto resta in questo browser.',
    destra: function () { var n = st.borsa.length; return '<a class="nx-btn ico t p-nb-borsa" href="#/borsa" aria-label="Borsa' + (n ? ', ' + n + (n === 1 ? ' paio' : ' paia') : ', vuota') + '">' + ic('borsa') + (n ? '<b class="x-badge">' + n + '</b>' : '') + '</a>'; },
    azione: function (k) { if (k === 'crea') G.vai('#/crea'); },
    viste: [
      { id: 'home', nome: 'Studio', ic: 'studio', tab: true, titolo: 'Passo Studio', render: vHome, senzaTitolo: function (s) { return s === 'b'; } },
      { id: 'modelli', nome: 'Modelli', ic: 'modelli', tab: true, titolo: 'Modelli', render: vModelli },
      { id: 'crea', nome: 'Crea', ic: 'crea', tab: true, titolo: 'Crea la tua', render: vCrea, dopo: segCrea, senzaTitolo: function (s) { return s === 'c'; } },
      { id: 'borsa', nome: 'Borsa', ic: 'borsa', tab: true, titolo: 'Borsa', render: vBorsa, dopo: function () { var s = $('#x-vista .p-sped'); if (s) NX.seg(s, function (x) { st.sped = x; salva(); G.aggiorna(); }); } }
    ]
  });
  G.badge('borsa', st.borsa.length);
})();
