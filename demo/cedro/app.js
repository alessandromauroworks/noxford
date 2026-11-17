/* Cedro - app dimostrativa sopra il kit Noxford. Nessun dato viene inviato: le scelte restano in questo browser. */
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

  /* ---------- Cedro, cucina libanese ---------- */
  G.chiave = 'cedro2-';
  I.cedro = '<path d="M12 3l6 8h-4l5 6H5l5-6H6z"/><path d="M12 17v4"/>';
  I.menu = '<path d="M4 12a8 8 0 0016 0zM3 12h18M12 4v2"/>';
  I.tavolo = '<rect x="4" y="5" width="16" height="15" rx="3"/><path d="M4 10h16M9 3v4M15 3v4"/>';

  var CAT = [['mezze', 'Mezze'], ['griglia', 'Griglia'], ['caldi', 'Piatti caldi'], ['dolci', 'Dolci']];
  var P = [
    { id: 'mezze', c: 'mezze', n: 'Mezze per due', d: 'Hummus, baba ghanoush, tabbouleh, falafel, sottaceti e pane caldo.', p: 24, pic: 1, adj: 1, veg: 1, img: 'img/mezze.webp', w: 1100, h: 821, alt: 'Tavola di mezze libanesi vista dall\'alto: hummus, baba ghanoush, falafel, sottaceti e pane pita', all: 'sesamo, glutine' },
    { id: 'hummus', c: 'mezze', n: 'Hummus', d: 'Ceci, tahina, limone e olio. Paprika a parte.', p: 7, pic: 0, adj: 1, veg: 1, all: 'sesamo' },
    { id: 'muhammara', c: 'mezze', n: 'Muhammara', d: 'Crema di peperoni arrostiti, noci e melassa di melograno.', p: 8, pic: 2, adj: 1, veg: 1, all: 'frutta a guscio, glutine' },
    { id: 'falafel', c: 'mezze', n: 'Falafel', d: 'Sei polpette di ceci e fave con salsa tahina.', p: 8, pic: 0, veg: 1, all: 'sesamo' },
    { id: 'grill', c: 'griglia', n: 'Griglia mista', d: 'Spiedini di pollo taouk e kafta di manzo, cipolla al sumac, toum all\'aglio.', p: 19, pic: 1, adj: 1, img: 'img/grill.webp', w: 1200, h: 896, alt: 'Piatto con spiedini di pollo e kafta alla griglia, salsa all\'aglio, pomodori e cipolle grigliate e pane', all: 'glutine' },
    { id: 'taouk', c: 'griglia', n: 'Shish taouk', d: 'Pollo marinato nello yogurt e paprika, patate all\'aglio.', p: 15, pic: 1, adj: 1, all: 'latte' },
    { id: 'samke', c: 'caldi', n: 'Samke harra', d: 'Merluzzo al forno con tahina, peperoncino e coriandolo.', p: 18, pic: 3, adj: 0, all: 'pesce, sesamo' },
    { id: 'mujaddara', c: 'caldi', n: 'Mujaddara', d: 'Lenticchie e riso con cipolle croccanti, yogurt a parte.', p: 12, pic: 0, veg: 1, all: 'latte' },
    { id: 'foul', c: 'caldi', n: 'Foul moudammas', d: 'Fave stufate con aglio, limone e olio, pane caldo.', p: 10, pic: 2, adj: 1, veg: 1, all: 'glutine' },
    { id: 'baklava', c: 'dolci', n: 'Baklava', d: 'Pasta fillo, pistacchi e sciroppo ai fiori d\'arancio. Quattro pezzi.', p: 6, pic: 0, veg: 1, all: 'glutine, frutta a guscio' },
    { id: 'mouhalabieh', c: 'dolci', n: 'Mouhalabieh', d: 'Budino al latte e acqua di rose con pistacchi.', p: 5, pic: 0, veg: 1, all: 'latte, frutta a guscio' }
  ];
  var LIV = ['Per niente', 'Delicato', 'Piccante', 'Molto piccante'];
  var LIVD = ['adatto a tutti, anche ai bambini', 'si sente appena', 'lo sente chi non è abituato', 'solo per chi ama il fuoco'];
  var ORE = ['19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30'];
  var RIT = ['12:30', '12:45', '13:00', '13:15', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30'];
  var GG = ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'], GGL = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var MM = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];
  var st = mem.get('stato', { borsa: [], tav: null, ord: null });
  var f = { cat: 'mezze', pic: 3, veg: false };
  var sel = { id: null, pic: 1, porz: 'n', q: 1 };
  var tav = { g: 0, pers: 2, ora: null, zona: 'sala', note: '' };
  var rit = { ora: null, nome: '' }, invio = false;
  var byId = function (id) { return P.filter(function (x) { return x.id === id; })[0]; };
  var giorno = function (k) { var x = new Date(); x.setHours(12, 0, 0, 0); x.setDate(x.getDate() + k); return x; };
  var pezzi = function () { return st.borsa.reduce(function (s, r) { return s + r.q; }, 0); };
  var salva = function () { mem.set('stato', st); G.badge('asporto', pezzi()); G.destra(); };
  var PEP = function (on) { return '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 5c2-1 5 0 6 2 1 3-2 7-7 8 2-3 0-6 1-10z" class="' + (on ? 'on' : 'off') + '"/><path d="M8 5c0-2 1-3 3-3" class="gambo"/></svg>'; };
  var pep = function (n) { var s = '<span class="c-pep" role="img" aria-label="' + LIV[n] + '">'; for (var i = 0; i < 3; i++) s += PEP(i < n); return s + '</span>'; };
  var prezzoRiga = function (x, porz) { return x.p + (porz === 'g' ? Math.round(x.p * 0.6) : 0); };
  var tot = function () { return st.borsa.reduce(function (s, r) { return s + r.p * r.q; }, 0); };
  var contenitori = function () { return st.borsa.length > 3 ? 0 : 0.5 * st.borsa.length; };
  function aperto() {
    var n = new Date(), m = n.getHours() * 60 + n.getMinutes();
    if (n.getDay() === 1) return ['Oggi chiuso · riapriamo domani alle 12', 'no'];
    if (m >= 720 && m < 900) return ['Aperto · cucina fino alle 14:45', 'ok'];
    if (m >= 1140 && m < 1410) return ['Aperto · cucina fino alle 23:30', 'ok'];
    return [m < 720 ? 'Apriamo alle 12:00' : m < 1140 ? 'Stasera apriamo alle 19:00' : 'Chiuso · domani dalle 12', 'wait'];
  }
  function aggiungi(x, pic, porz, q) {
    var pz = prezzoRiga(x, porz), ex = st.borsa.filter(function (r) { return r.id === x.id && r.pic === pic && r.porz === porz; })[0];
    if (ex) ex.q += q; else st.borsa.push({ id: x.id, n: x.n, pic: pic, porz: porz, p: pz, q: q });
    st.ord = null; salva();
  }
  function foto(x, cl) { return x.img ? '<img class="' + (cl || '') + '" src="' + x.img + '" width="' + x.w + '" height="' + x.h + '" alt="' + x.alt + '" loading="lazy">' : ''; }
  function segnaposto(x, cl) { return '<div class="c-ph ' + (cl || '') + '" aria-hidden="true"><span>' + x.n + '</span></div>'; }

  /* --- Home --- */
  function vHome() {
    var a = aperto(), s = G.stile, m = byId('mezze'), g = byId('grill');
    var stato = '<span class="nx-pill ' + a[1] + '">' + a[0] + '</span>';
    var leg = '<ul class="nx-lista">' + LIV.map(function (l, i) { return '<li><div class="nx-cella"><span class="c-pep-box">' + pep(i) + '</span><span class="nx-c-tx"><b>' + l + '</b><small class="w">' + LIVD[i] + '</small></span></div></li>'; }).join('') + '</ul>';
    if (s === 'b') {
      return '<figure class="c-hero"><img src="img/sala.webp" width="896" height="1200" alt="La sala del ristorante la sera: pareti verde scuro, lanterne di ottone, tavoli di legno apparecchiati e piastrelle a disegni" fetchpriority="high"><figcaption>' + stato + '<h2 class="c-serif">Mezze da dividere, <em>griglia a carbone.</em></h2></figcaption></figure>' +
        '<div class="c-cta"><a class="nx-btn p" href="#/prenota">' + ic('tavolo') + 'Prenota un tavolo</a><a class="nx-btn" href="#/menu">Ordina da asporto</a></div>' +
        '<p class="c-k">Il piatto di oggi</p><a class="c-big" href="#/piatto/mezze" data-nx-premi>' + foto(m) + '<span><b class="c-serif">' + m.n + '</b><small>' + m.d + '</small><em class="nx-num">' + eur(m.p) + '</em></span></a>' +
        '<p class="c-k">Dalla griglia</p><a class="c-big" href="#/piatto/grill" data-nx-premi>' + foto(g) + '<span><b class="c-serif">' + g.n + '</b><small>' + g.d + '</small><em class="nx-num">' + eur(g.p) + '</em></span></a>' +
        '<p class="c-k">Come leggere il piccante</p>' + leg;
    }
    if (s === 'c') {
      var top = ['mezze', 'grill', 'falafel', 'baklava'].map(byId);
      return '<div class="c-stato">' + stato + '<span class="x-mini">mar–dom 12–14:45 · 19–23:30</span></div>' +
        '<div class="c-tiles"><a href="#/menu" class="c-tile p" data-nx-premi>' + ic('borsa') + '<b>Ordina da asporto</b><small>ritiro in 20 minuti</small></a>' +
        '<a href="#/prenota" class="c-tile" data-nx-premi>' + ic('tavolo') + '<b>Prenota</b><small>' + (st.tav ? 'hai un tavolo ' + st.tav.g : 'sala o dehors') + '</small></a>' +
        '<a href="#/asporto" class="c-tile" data-nx-premi>' + ic('ora') + '<b>Il tuo ordine</b><small>' + (st.ord ? 'n. ' + st.ord.num + ' alle ' + st.ord.ora : pezzi() ? pezzi() + ' piatti, ' + eur(tot()) : 'vuoto') + '</small></a>' +
        '<a href="#/menu" class="c-tile" data-nx-premi>' + ic('menu') + '<b>Menu</b><small>' + P.length + ' piatti</small></a></div>' +
        '<h2 class="x-h2">I più ordinati<small>aggiungi con +</small></h2><ul class="nx-lista c-rapida">' + top.map(rigaRapida).join('') + '</ul>';
    }
    return '<p class="x-sotto">Cucina libanese, mezze da dividere e griglia a carbone.</p>' +
      '<figure class="c-card-foto"><img src="img/sala.webp" width="896" height="1200" alt="La sala del ristorante la sera: pareti verde scuro, lanterne di ottone, tavoli di legno apparecchiati e piastrelle a disegni" fetchpriority="high"><figcaption>' + stato + '</figcaption></figure>' +
      '<div class="c-cta"><a class="nx-btn p" href="#/prenota">' + ic('tavolo') + 'Prenota un tavolo</a><a class="nx-btn" href="#/menu">Ordina da asporto</a></div>' +
      '<p class="nx-gruppo-t">Il piatto di oggi</p><div class="nx-gruppo"><ul class="nx-lista"><li><a class="nx-cella c-oggi" href="#/piatto/mezze"><img src="' + m.img + '" alt="" width="64" height="64" loading="lazy"><span class="nx-c-tx"><b>' + m.n + '</b><small class="w">' + m.d + '</small></span><span class="nx-c-dx nx-num">' + eur(m.p) + '<i class="nx-chev"></i></span></a></li></ul></div>' +
      '<p class="nx-gruppo-t">Come leggere il piccante</p><div class="nx-gruppo">' + leg + '</div>' +
      '<p class="nx-gruppo-t">Orari</p><ul class="nx-lista"><li><div class="nx-cella ic"><span class="nx-c-ic">' + ic('ora') + '</span><span class="nx-c-tx"><b>Martedì–domenica</b><small>12–14:45 e 19–23:30 · lunedì chiuso</small></span></div></li><li><div class="nx-cella ic"><span class="nx-c-ic">' + ic('pin') + '</span><span class="nx-c-tx"><b>Indirizzo di esempio</b><small>parcheggio nel cortile</small></span></div></li></ul>';
  }
  function rigaRapida(x) {
    return '<li><div class="nx-cella"><a class="nx-c-tx c-link" href="#/piatto/' + x.id + '"><b>' + x.n + '</b><small>' + pep(x.pic) + ' ' + eur(x.p) + '</small></a><button type="button" class="nx-btn ico p c-add" data-add="' + x.id + '" aria-label="Aggiungi ' + x.n + ' all\'asporto">' + ic('piu') + '</button></div></li>';
  }

  /* --- Menu --- */
  function filtri() {
    return '<div class="nx-chips c-cat" role="group" aria-label="Categoria">' + (G.stile === 'b' ? '' : CAT.map(function (c) { return '<button type="button" class="nx-chip" data-cat="' + c[0] + '" aria-pressed="' + (c[0] === f.cat) + '">' + c[1] + '</button>'; }).join('')) + '</div>' +
      '<div class="c-filtri"><div class="nx-seg c-seg-pic" role="group" aria-label="Piccante al massimo">' + [3, 0, 1, 2].map(function (i) { return '<button type="button" data-v="' + i + '" aria-pressed="' + (i === f.pic) + '"' + (i === 3 ? '>Tutti' : ' aria-label="Piccante al massimo: ' + LIV[i].toLowerCase() + '">' + pep(i)) + '</button>'; }).join('') + '</div>' +
      '<button type="button" class="nx-chip" data-veg aria-pressed="' + f.veg + '">Solo veg</button></div>';
  }
  function filtra(c) { return P.filter(function (x) { return (!c || x.c === c) && x.pic <= f.pic && (!f.veg || x.veg); }); }
  function vMenu() {
    var s = G.stile, vuoto = NX.stato.vuoto('Nessun piatto', 'Nessun piatto con questi filtri. Prova ad allargare il piccante o a togliere solo veg.', ['Togli i filtri', 'azzera']);
    if (s === 'b') {
      var h = CAT.map(function (c) {
        var l = filtra(c[0]); if (!l.length) return '';
        var fx = l.filter(function (x) { return x.img; })[0];
        return '<section class="c-carta"><h2 class="c-serif">' + c[1] + '</h2>' + (fx ? '<a href="#/piatto/' + fx.id + '" class="c-carta-foto">' + foto(fx) + '</a>' : '') +
          l.map(function (x) { return '<a class="c-voce" href="#/piatto/' + x.id + '" data-nx-premi><span class="c-voce-r"><b class="c-serif">' + x.n + '</b><i aria-hidden="true"></i><em class="nx-num">' + eur(x.p, 0) + '</em></span><small>' + x.d + '</small><span class="c-voce-m">' + pep(x.pic) + (x.veg ? '<span class="nx-pill ok">veg</span>' : '') + '</span></a>'; }).join('') + '</section>';
      }).join('');
      return filtri() + (h || vuoto);
    }
    var l = filtra(f.cat);
    if (!l.length) return filtri() + vuoto;
    if (s === 'c') return filtri() + '<div class="c-griglia">' + l.map(function (x) {
      return '<div class="c-g"><a href="#/piatto/' + x.id + '" class="c-g-l">' + (x.img ? foto(x, 'c-g-img') : '') + '<b>' + x.n + '</b><small>' + x.d + '</small></a><div class="c-g-p"><span><em class="nx-num">' + eur(x.p, 0) + '</em>' + pep(x.pic) + '</span><button type="button" class="nx-btn ico p c-add" data-add="' + x.id + '" aria-label="Aggiungi ' + x.n + ' all\'asporto">' + ic('piu') + '</button></div></div>';
    }).join('') + '</div>' + (pezzi() ? '<a class="c-barra nx-vetro" href="#/asporto">' + ic('borsa') + '<span>' + pezzi() + (pezzi() === 1 ? ' piatto' : ' piatti') + '</span><b class="nx-num">' + eur(tot()) + '</b><span class="c-barra-v">Vai al ritiro</span></a>' : '');
    return filtri() + '<ul class="nx-lista c-lista">' + l.map(function (x) {
      return '<li><a class="nx-cella" href="#/piatto/' + x.id + '">' + (x.img ? '<img class="c-th" src="' + x.img + '" alt="" width="56" height="56" loading="lazy">' : '') + '<span class="nx-c-tx"><b>' + x.n + (x.veg ? ' <span class="nx-pill ok c-veg">veg</span>' : '') + '</b><small class="w">' + x.d + '</small><span class="c-riga-pep">' + pep(x.pic) + '<span>' + LIV[x.pic].toLowerCase() + '</span></span></span><span class="nx-c-dx nx-num">' + eur(x.p) + '<i class="nx-chev"></i></span></a></li>';
    }).join('') + '</ul>';
  }

  /* --- Piatto --- */
  function vPiatto(id) {
    var x = byId(id) || P[0];
    if (sel.id !== x.id) sel = { id: x.id, pic: x.pic, porz: 'n', q: 1 };
    var prezzo = prezzoRiga(x, sel.porz) * sel.q;
    return '<div class="c-p-media">' + (x.img ? foto(x, 'c-p-img') : segnaposto(x, 'c-p-img')) + '</div>' +
      '<h2 class="c-serif c-p-nome">' + x.n + (x.veg ? ' <span class="nx-pill ok">veg</span>' : '') + '</h2><p class="c-p-desc">' + x.d + '</p>' +
      '<p class="x-lab">Quanto piccante' + (x.adj ? '' : ' · questo piatto si fa solo così') + '</p><div class="c-scala" role="group" aria-label="Livello di piccante">' + LIV.map(function (l, i) { return '<button type="button" data-pic="' + i + '" aria-pressed="' + (i === sel.pic) + '"' + (!x.adj && i !== x.pic ? ' disabled' : '') + '>' + pep(i) + '<span>' + l + '</span></button>'; }).join('') + '</div>' +
      '<p class="x-lab">Porzione</p><div class="nx-seg pieno c-porz" role="group" aria-label="Porzione"><button type="button" data-v="n" aria-pressed="' + (sel.porz === 'n') + '">Normale · ' + eur(x.p, 0) + '</button><button type="button" data-v="g" aria-pressed="' + (sel.porz === 'g') + '">Da dividere · +' + eur(Math.round(x.p * 0.6), 0) + '</button></div>' +
      '<p class="c-all"><b>Allergeni:</b> ' + x.all + '. Per allergie gravi chiamaci prima di ordinare.</p>' +
      '<div class="c-addbar"><div class="x-qt"><button type="button" class="nx-btn" data-q="-1" aria-label="Uno in meno"' + (sel.q <= 1 ? ' disabled' : '') + '>' + ic('meno') + '</button><b>' + sel.q + '</b><button type="button" class="nx-btn" data-q="1" aria-label="Uno in più">' + ic('piu') + '</button></div><button class="nx-btn p" type="button" id="c-p-add">Aggiungi · ' + eur(prezzo) + '</button></div>';
  }

  /* --- Prenota --- */
  function vPrenota() {
    if (st.tav) {
      var t = st.tav;
      return '<div class="x-card x-ok"><span class="x-ok-ic">' + ic('ok') + '</span><h2>Tavolo prenotato</h2><span class="x-num">' + t.pers + '</span><p>' + (t.pers === 1 ? 'persona' : 'persone') + ' · ' + t.g + ' alle ' + t.ora + '</p><p>' + (t.zona === 'sala' ? 'In sala, vicino alla griglia' : 'Nel dehors coperto e riscaldato') + (t.note ? ' · ' + esc(t.note) : '') + '</p>' +
        '<div class="x-azioni" style="align-self:stretch"><button type="button" class="nx-btn p" data-a="ics">' + ic('cal') + 'Aggiungi al calendario</button><button type="button" class="nx-btn r" data-a="annulla-tav">Annulla la prenotazione</button></div>' +
        '<p class="x-nota">Se tardi più di 15 minuti scrivici: teniamo il tavolo. Demo: non parte nessun messaggio.</p></div>';
    }
    var g = '';
    if (giorno(tav.g).getDay() === 1) tav.g++;
    for (var k = 0; k < 12; k++) { var dd = giorno(k), ch = dd.getDay() === 1; g += '<button type="button" data-tg="' + k + '" aria-pressed="' + (k === tav.g) + '"' + (ch ? ' disabled aria-label="' + GGL[dd.getDay()] + ' ' + dd.getDate() + ', chiuso"' : '') + '><small>' + (k === 0 ? 'oggi' : GG[dd.getDay()]) + '</small><b>' + dd.getDate() + '</b></button>'; }
    var d0 = giorno(tav.g), adesso = new Date(), minNow = adesso.getHours() * 60 + adesso.getMinutes();
    var orari = ORE.map(function (o, i) {
      var hm = o.split(':'), passato = tav.g === 0 && +hm[0] * 60 + +hm[1] < minNow + 30;
      var pieno = passato || ((d0.getDate() + i * 3 + tav.pers) % 5 === 0) || (d0.getDay() === 6 && i === 2);
      if (pieno && tav.ora === o) tav.ora = null;
      return '<button type="button" data-to="' + o + '" aria-pressed="' + (tav.ora === o) + '"' + (pieno ? ' disabled aria-label="' + o + ', non disponibile"' : '') + '>' + o + '</button>';
    });
    var liberi = orari.filter(function (h) { return h.indexOf('disabled') < 0; }).length, S = G.stile;
    var lab = function (n, t, primo) { return S === 'b' ? '<h3 class="c-passo"><span class="nx-num">' + n + '</span>' + t + '</h3>' : '<p class="x-lab"' + (primo ? ' style="margin-top:0"' : '') + '>' + t + '</p>'; };
    var persone = '<div class="x-step"><button type="button" class="nx-btn ico" data-tp="-1" aria-label="Una persona in meno"' + (tav.pers <= 1 ? ' disabled' : '') + '>' + ic('meno') + '</button><b>' + tav.pers + (S === 'c' ? '' : tav.pers === 1 ? ' persona' : ' persone') + '</b><button type="button" class="nx-btn ico" data-tp="1" aria-label="Una persona in più"' + (tav.pers >= 14 ? ' disabled' : '') + '>' + ic('piu') + '</button></div>' + (tav.pers > 8 ? '<p class="x-nota">Oltre 8 persone vi mettiamo nella sala piccola, tutta per voi.</p>' : '');
    var zona = '<div class="nx-seg pieno c-zona" role="group" aria-label="Zona"><button type="button" data-v="sala" aria-pressed="' + (tav.zona === 'sala') + '">In sala</button><button type="button" data-v="dehors" aria-pressed="' + (tav.zona === 'dehors') + '">' + (S === 'c' ? 'Dehors' : 'Dehors riscaldato') + '</button></div>';
    var ore = (liberi ? '<div class="x-orari" role="group" aria-label="Orario">' + orari.join('') + '</div>' : '<div class="x-card c-pieno">' + NX.stato.vuoto('Stasera è pieno', 'Non ci sono più tavoli liberi per ' + (tav.g === 0 ? 'stasera' : 'questo giorno') + '. Prova il giorno dopo.') + '</div>');
    var giorni = '<div class="x-giorni" role="group" aria-label="Giorno">' + g + '</div>';
    var corpo = S === 'b' ? lab(1, 'Quando', 1) + giorni + '<div style="height:12px"></div>' + ore + lab(2, 'Quante persone') + persone + lab(3, 'Dove') + zona
      : S === 'c' ? '<div class="c-due"><div><p class="x-lab" style="margin-top:0">Persone</p>' + persone + '</div><div><p class="x-lab" style="margin-top:0">Dove</p>' + zona + '</div></div><p class="x-lab">Giorno</p>' + giorni + '<p class="x-lab">Orario, cena</p>' + ore
      : lab(1, 'Giorno', 1) + giorni + '<p class="x-lab">Persone</p>' + persone + '<p class="x-lab">Orario, cena</p>' + ore + '<p class="x-lab">Dove</p>' + zona;
    return corpo +
      '<label class="nx-campo" style="margin-top:20px"><span>Allergie o occasioni</span><textarea id="c-pr-note" rows="2" maxlength="160" placeholder="Es. un celiaco, un compleanno">' + esc(tav.note) + '</textarea></label><p class="x-err" id="c-pr-err" role="alert"></p>' +
      '<button class="nx-btn p pieno" type="button" id="c-pr-ok"' + (invio ? ' disabled' : '') + '>' + (invio ? '<span class="x-carica" aria-hidden="true"></span>Controllo il tavolo…' : 'Prenota il tavolo') + '</button><p class="x-nota">Demo: non inviamo nulla. Nella versione vera ti arriva un messaggio di conferma.</p>';
  }
  function ics() {
    var t = st.tav; if (!t) return;
    var dd = new Date(t.ts), p2 = function (n) { return ('0' + n).slice(-2); }, hm = t.ora.split(':');
    var s = '' + dd.getFullYear() + p2(dd.getMonth() + 1) + p2(dd.getDate()) + 'T' + p2(+hm[0]) + p2(+hm[1]) + '00';
    var e = '' + dd.getFullYear() + p2(dd.getMonth() + 1) + p2(dd.getDate()) + 'T' + p2(+hm[0] + 2) + p2(+hm[1]) + '00';
    var txt = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Cedro demo//IT', 'BEGIN:VEVENT', 'UID:cedro-' + t.ts + '@demo', 'DTSTAMP:' + s, 'DTSTART:' + s, 'DTEND:' + e, 'SUMMARY:Cena da Cedro (' + t.pers + ' persone)', 'DESCRIPTION:Prenotazione di esempio in un ristorante inventato.', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    var a = d.createElement('a'), u = URL.createObjectURL(new Blob([txt], { type: 'text/calendar;charset=utf-8' }));
    a.href = u; a.download = 'cena-cedro.ics'; d.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(u); a.remove(); }, 800);
    NX.toast('Evento pronto per il calendario.');
  }

  /* --- Asporto --- */
  function giornoRitiro() {
    var n = new Date(), m = n.getHours() * 60 + n.getMinutes(), k = 0;
    var liberoOggi = n.getDay() !== 1 && RIT.some(function (o) { var hm = o.split(':'); return +hm[0] * 60 + +hm[1] >= m + 20; });
    if (!liberoOggi) { k = 1; if (giorno(1).getDay() === 1) k = 2; }
    return k;
  }
  function vAsporto() {
    if (st.ord) return '<div class="x-card x-ok"><span class="x-ok-ic">' + ic('ok') + '</span><h2>Ordine ricevuto</h2><span class="x-num">' + st.ord.num + '</span><p>Il tuo numero di ritiro. Passa ' + st.ord.quando + ' alle <b>' + st.ord.ora + '</b>.</p><p>Totale ' + st.ord.tot + ', si paga al ritiro.</p><button class="nx-btn" type="button" data-a="nuovo">Nuovo ordine</button><p class="x-nota">Demo: nessun ordine parte davvero.</p></div>';
    if (!st.borsa.length) return NX.stato.vuoto('L\'ordine è vuoto', 'Scegli i piatti dal menu: li ritiri caldi all\'orario che preferisci.', ['Vai al menu', 'menu']);
    var k = giornoRitiro(), n = new Date(), m = n.getHours() * 60 + n.getMinutes(), cont = contenitori();
    return '<ul class="nx-lista c-borsa">' + st.borsa.map(function (r, i) {
      return '<li><div class="nx-cella"><span class="nx-c-tx"><b>' + r.n + '</b><small>' + LIV[r.pic].toLowerCase() + (r.porz === 'g' ? ' · da dividere' : '') + ' · ' + eur(r.p) + '</small></span><div class="x-qt"><button type="button" class="nx-btn" data-bq="' + i + '" data-d="-1" aria-label="' + (r.q === 1 ? 'Togli ' + r.n : 'Uno in meno') + '">' + ic(r.q === 1 ? 'x' : 'meno') + '</button><b>' + r.q + '</b><button type="button" class="nx-btn" data-bq="' + i + '" data-d="1" aria-label="Uno in più">' + ic('piu') + '</button></div></div></li>';
    }).join('') + '</ul><a class="nx-btn t" href="#/menu" style="margin-top:6px">' + ic('piu') + 'Aggiungi altro</a>' +
      '<p class="x-lab">Orario di ritiro · ' + (k === 0 ? 'oggi' : k === 1 ? 'domani' : GGL[giorno(k).getDay()]) + '</p><div class="x-orari" role="group" aria-label="Orario di ritiro">' + RIT.map(function (o) {
        var hm = o.split(':'), passato = k === 0 && +hm[0] * 60 + +hm[1] < m + 20; if (passato && rit.ora === o) rit.ora = null;
        return '<button type="button" data-ro="' + o + '" aria-pressed="' + (rit.ora === o) + '"' + (passato ? ' disabled aria-label="' + o + ', troppo presto"' : '') + '>' + o + '</button>';
      }).join('') + '</div>' +
      '<label class="nx-campo" style="margin-top:20px"><span>Nome per il ritiro</span><input id="c-as-nome" autocomplete="given-name" placeholder="Come ti chiami" value="' + esc(rit.nome) + '"></label>' +
      '<div class="x-card" style="margin-top:6px"><div class="x-righe"><p><span>Piatti</span><span>' + eur(tot()) + '</span></p><p><span>Contenitori compostabili</span><span>' + (cont ? eur(cont) : 'gratis') + '</span></p><p class="t"><span>Totale</span><span>' + eur(tot() + cont) + '</span></p></div></div>' +
      '<p class="x-nota">Contenitori gratis da 4 piatti in su. Si paga al ritiro.</p><p class="x-err" id="c-as-err" role="alert"></p>' +
      '<button class="nx-btn p pieno" type="button" id="c-as-ok" style="margin-top:14px">Ordina e ritira · ' + eur(tot() + cont) + '</button>';
  }

  /* --- eventi --- */
  d.addEventListener('input', function (e) {
    if (e.target.id === 'c-pr-note') tav.note = e.target.value;
    else if (e.target.id === 'c-as-nome') { rit.nome = e.target.value; $('#c-as-err').textContent = ''; }
  });
  d.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b || b.disabled) return;
    var a = b.getAttribute('data-a');
    if (b.dataset.add) { var x = byId(b.dataset.add); aggiungi(x, x.pic, 'n', 1); NX.toast(x.n + ' aggiunto all\'asporto.'); if (G.v.id === 'menu') G.aggiorna(); }
    else if (b.dataset.cat) { f.cat = b.dataset.cat; G.aggiorna(); }
    else if (b.hasAttribute('data-veg')) { f.veg = !f.veg; G.aggiorna(); }
    else if (b.dataset.pic) { sel.pic = +b.dataset.pic; G.aggiorna(); }
    else if (b.dataset.q) { sel.q = Math.max(1, Math.min(9, sel.q + +b.dataset.q)); G.aggiorna(); }
    else if (b.id === 'c-p-add') { var y = byId(sel.id); aggiungi(y, sel.pic, sel.porz, sel.q); NX.toast(sel.q + ' × ' + y.n + ' nell\'asporto.'); sel.id = null; G.vai('#/menu'); }
    else if (b.dataset.tg) { tav.g = +b.dataset.tg; tav.ora = null; G.aggiorna(); }
    else if (b.dataset.tp) { tav.pers = Math.max(1, Math.min(14, tav.pers + +b.dataset.tp)); G.aggiorna(); }
    else if (b.dataset.to) { tav.ora = b.dataset.to; $('#c-pr-err').textContent = ''; $$('[data-to]').forEach(function (z) { z.setAttribute('aria-pressed', z === b); }); }
    else if (b.id === 'c-pr-ok') {
      if (!tav.ora) { $('#c-pr-err').textContent = 'Scegli un orario libero.'; return; }
      invio = true; G.aggiorna();
      setTimeout(function () { var dd = giorno(tav.g); invio = false; st.tav = { g: GGL[dd.getDay()] + ' ' + dd.getDate() + ' ' + MM[dd.getMonth()], ts: +dd, pers: tav.pers, ora: tav.ora, zona: tav.zona, note: tav.note.trim() }; salva(); if (G.v.id === 'prenota') G.aggiorna(); NX.toast('Tavolo prenotato.'); }, ridotto() ? 150 : 900);
    }
    else if (a === 'ics') ics();
    else if (a === 'annulla-tav') { st.tav = null; tav.ora = null; salva(); G.aggiorna(); NX.toast('Prenotazione annullata.', 'info'); }
    else if (b.dataset.bq) { var r = st.borsa[+b.dataset.bq]; r.q += +b.dataset.d; if (r.q < 1) { st.borsa.splice(+b.dataset.bq, 1); NX.toast(r.n + ' tolto.', 'info'); } salva(); G.aggiorna(); }
    else if (b.dataset.ro) { rit.ora = b.dataset.ro; $('#c-as-err').textContent = ''; $$('[data-ro]').forEach(function (z) { z.setAttribute('aria-pressed', z === b); }); }
    else if (b.id === 'c-as-ok') {
      var err = $('#c-as-err');
      if (!rit.ora) { err.textContent = 'Scegli l\'orario di ritiro.'; return; }
      if (rit.nome.trim().length < 2) { err.textContent = 'Scrivi il nome per il ritiro.'; $('#c-as-nome').focus(); return; }
      var k = giornoRitiro();
      st.ord = { num: 40 + (new Date().getMinutes() % 50), ora: rit.ora, quando: k === 0 ? 'oggi' : k === 1 ? 'domani' : GGL[giorno(k).getDay()], tot: eur(tot() + contenitori()) };
      st.borsa = []; rit.ora = null; salva(); window.scrollTo(0, 0); G.aggiorna(); NX.toast('Ordine inviato alla cucina.');
    }
    else if (a === 'nuovo') { st.ord = null; salva(); G.vai('#/menu'); }
  });

  G.avvia({
    nome: 'Cedro', sotto: 'cucina libanese',
    logo: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect width="48" height="48" rx="14" fill="var(--nx-tinta-pieno)"/><path d="M24 9l10 13h-6l8 10H12l8-10h-6z" fill="#E0A526"/><path d="M24 32v7" stroke="#E0A526" stroke-width="3" stroke-linecap="round"/></svg>',
    stili: { a: ['Classico', 'Liste come le app di sistema: menu ordinato per categoria, prenotazione passo per passo.'], b: ['Sala', 'Come la carta stampata del ristorante: foto grandi, titoli con le grazie, prezzi allineati.'], c: ['Banco', 'Per ordinare in fretta: griglia di piatti con il + e il totale sempre in vista.'] },
    nota: 'Attività inventata, piatti e prezzi di esempio. Ordini e prenotazioni restano solo in questo browser.',
    descr: 'App di un ristorante libanese inventato: menu con il livello di piccante, prenotazione del tavolo e asporto con orario di ritiro. Niente parte davvero: tutto resta in questo browser.',
    destra: function () { var n = pezzi(); return '<a class="nx-btn ico t c-nb-borsa" href="#/asporto" aria-label="Asporto' + (n ? ', ' + n + ' piatti' : ', vuoto') + '">' + ic('borsa') + (n ? '<b class="x-badge">' + n + '</b>' : '') + '</a>'; },
    azione: function (k) { if (k === 'menu') G.vai('#/menu'); else if (k === 'azzera') { f.pic = 3; f.veg = false; G.aggiorna(); } },
    viste: [
      { id: 'home', nome: 'Cedro', ic: 'cedro', tab: true, titolo: 'Cedro', render: vHome, senzaTitolo: function (s) { return s === 'b'; } },
      { id: 'menu', nome: 'Menu', ic: 'menu', tab: true, titolo: 'Menu', render: vMenu, dopo: function () { var s = $('#x-vista .c-seg-pic'); if (s) NX.seg(s, function (v) { f.pic = +v; G.aggiorna(); }); } },
      { id: 'piatto', nome: 'Piatto', di: 'menu', indietro: ['#/menu', 'Menu'], titolo: function (id) { return (byId(id) || P[0]).n; }, render: vPiatto, senzaTitolo: function () { return true; }, dopo: function () { var s = $('#x-vista .c-porz'); if (s) NX.seg(s, function (v) { sel.porz = v; G.aggiorna(); }); } },
      { id: 'prenota', nome: 'Tavolo', ic: 'tavolo', tab: true, titolo: 'Prenota un tavolo', corto: 'Tavolo', render: vPrenota, dopo: function () { centra($('#x-vista .x-giorni')); var s = $('#x-vista .c-zona'); if (s) NX.seg(s, function (v) { tav.zona = v; }); } },
      { id: 'asporto', nome: 'Asporto', ic: 'borsa', tab: true, titolo: 'Asporto', render: vAsporto }
    ]
  });
  G.badge('asporto', pezzi());
})();
