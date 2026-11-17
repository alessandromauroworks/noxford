/* Nido Il Gelso - app dimostrativa sopra il kit Noxford. Nessun dato viene inviato: le scelte restano in questo browser. */
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

  /* ---------- Nido Il Gelso ---------- */
  G.chiave = 'gelso2-';
  I.sole = '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M18.7 5.3l-1.8 1.8M7.1 16.9l-1.8 1.8"/>';
  I.campana = '<path d="M5 17h14l-2-3v-4a5 5 0 00-10 0v4zM10 20h4"/>';
  I.ciotola = '<path d="M4 12a8 8 0 0016 0zM3 12h18M9 8c0-2 2-2 2-4M14 8c0-2 2-2 2-4"/>';
  I.calok = '<rect x="4" y="5" width="16" height="15" rx="3"/><path d="M4 10h16M9 3v4M15 3v4M9 15l2 2 4-4"/>';
  I.carta = '<rect x="3" y="6" width="18" height="13" rx="3"/><path d="M3 10h18M7 15h4"/>';
  I.arrivo = '<path d="M4 20V9l8-5 8 5v11M10 20v-6h4v6"/>';
  I.pappa = '<path d="M4 12a8 8 0 0016 0zM12 4v4"/>';
  I.gioco = '<rect x="4" y="12" width="7" height="7" rx="1.5"/><rect x="13" y="12" width="7" height="7" rx="1.5"/><rect x="8.5" y="4" width="7" height="7" rx="1.5"/>';
  I.nanna = '<path d="M19 14.5A7.5 7.5 0 019.5 5a7.5 7.5 0 109.5 9.5z"/>';
  I.cambio = '<path d="M5 8h14l-2 10H7zM9 8V6h6v2"/>';
  I.uscita = '<path d="M14 4h5v16h-5M10 8l-4 4 4 4M6 12h9"/>';
  I.cuore = '<path d="M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z"/>';

  var GG = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var MM = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
  var cap = function (s) { return s.charAt(0).toUpperCase() + s.slice(1); };
  var GIORNATA = [
    [8, 10, 'arrivo', 'Entrata', 'L\'ha accompagnato papà. Un po\' di sonno, poi subito a giocare.'],
    [9, 0, 'pappa', 'Merenda', 'Mela grattugiata e un biscotto: mangiato tutto.'],
    [9, 30, 'gioco', 'Gioco in salone', 'Costruzioni di legno e travasi con la farina gialla.'],
    [10, 40, 'cambio', 'Cambio', 'Pannolino cambiato, tutto regolare.'],
    [11, 30, 'pappa', 'Pranzo', 'Pasta al pomodoro, merluzzo e carote. Ha chiesto il bis della pasta.'],
    [12, 45, 'nanna', 'Nanna', 'Si è addormentato da solo con il suo coniglietto.'],
    [14, 50, 'pappa', 'Merenda', 'Yogurt bianco e banana.'],
    [15, 30, 'gioco', 'Giardino', 'Sabbiera e bolle di sapone.'],
    [16, 0, 'uscita', 'Uscita', 'Ritiro previsto dalla nonna Anna, già autorizzata.']
  ];
  var NOTA = 'Oggi ha costruito una torre altissima con i cubi di legno e l\'ha fatta crollare ridendo. Domani portate un cambio in più: si va in giardino a travasare la sabbia.';
  var AVV = [
    { id: 'gita', tag: 'Gita', d: 'oggi', t: 'Mattina alla fattoria didattica', p: 'Venerdì 28 andiamo a vedere gli asinelli, a dieci minuti dal nido. Partenza 9:30, rientro per il pranzo. Serve la vostra autorizzazione.', az: [['si', 'Autorizzo'], ['no', 'Non partecipa']] },
    { id: 'riunione', tag: 'Riunione', d: 'ieri', t: 'Incontro con i genitori dei Pulcini', p: 'Giovedì 4 dicembre alle 17:30 in salone: come sta andando l\'inserimento e la festa di Natale.', az: [['si', 'Ci sarò'], ['no', 'Non posso']] },
    { id: 'cambi', tag: 'Da portare', d: 'lun 10 nov', t: 'Cambio completo e calzini antiscivolo', p: 'Con il freddo usciamo comunque in giardino: un cambio in più nell\'armadietto, grazie.', az: [['letto', 'Ho letto']] },
    { id: 'ponte', tag: 'Chiusura', d: 'mar 4 nov', t: 'Lunedì 8 dicembre il nido è chiuso', p: 'Riapriamo martedì 9 alle 7:30 come sempre.', az: [['letto', 'Ho letto']] }
  ];
  var MENU = [
    { m: 'Mela grattugiata', p: 'Pasta al pomodoro', s: 'Merluzzo al forno', c: 'Carote al vapore', po: 'Yogurt bianco e banana', a: ['glutine', 'pesce', 'latte'] },
    { m: 'Pera e gallette di riso', p: 'Risotto alla zucca', s: 'Frittata alle erbe', c: 'Fagiolini', po: 'Pane e olio', a: ['uovo', 'latte', 'glutine'], sost: 'Frittata: per Tommaso polpettine di ceci' },
    { m: 'Banana', p: 'Minestra di verdure con orzo', s: 'Pollo al limone', c: 'Patate al forno', po: 'Budino di riso fatto da noi', a: ['glutine', 'latte', 'sedano'] },
    { m: 'Kiwi', p: 'Pasta con lenticchie', s: 'Formaggio fresco', c: 'Insalata di finocchi', po: 'Torta di mele', a: ['glutine', 'latte', 'uovo'], sost: 'Torta di mele: per Tommaso mela cotta con cannella' },
    { m: 'Clementine', p: 'Gnocchetti al ragù di verdure', s: 'Polpette di manzo', c: 'Piselli', po: 'Pane e marmellata', a: ['glutine', 'uovo'], sost: 'Polpette: per Tommaso preparate senza uovo' }
  ];
  var MOT = ['Malattia', 'Visita medica', 'Vacanza', 'Altro'];
  var st = mem.get('stato', { risp: {}, ass: [], pagato: false, metodo: 'carta' });
  var oggi = function () { var x = new Date(); x.setHours(12, 0, 0, 0); return x; };
  var feriale = function (x) { return x.getDay() > 0 && x.getDay() < 6; };
  var menuG = Math.min(4, Math.max(0, oggi().getDay() - 1));
  var filtroAvv = 'da', asSel = { g: null, m: null }, pagando = false;
  var salva = function () { mem.set('stato', st); contaAvvisi(); };
  var daLeggere = function () { return AVV.filter(function (a) { return !st.risp[a.id]; }).length; };
  var contaAvvisi = function () { G.badge('avvisi', daLeggere()); };
  var hm = function (g) { return g[0] + ':' + ('0' + g[1]).slice(-2); };

  function giornata() {
    var now = new Date(), dd = oggi(), chiuso = !feriale(dd), min = now.getHours() * 60 + now.getMinutes();
    if (chiuso) { while (!feriale(dd)) dd.setDate(dd.getDate() - 1); min = 24 * 60; }
    var fatti = GIORNATA.filter(function (g) { return g[0] * 60 + g[1] <= min; });
    var pranzo = fatti.some(function (g) { return g[3] === 'Pranzo'; }), nanna = fatti.some(function (g) { return g[3] === 'Nanna'; });
    return {
      d: dd, chiuso: chiuso, min: min, fatti: fatti,
      data: (chiuso ? 'Oggi il nido è chiuso. Ecco ' : '') + GG[dd.getDay()] + ' ' + dd.getDate() + ' ' + MM[dd.getMonth()],
      sintesi: [['cuore', 'Umore', 'sereno', 'ok'], ['pappa', 'Pranzo', pranzo ? 'tutto, con il bis' : 'alle 11:30', 'wait'], ['nanna', 'Nanna', nanna ? (min >= 14 * 60 + 20 ? '1 h 35 min' : 'dorme ora') : 'dopo pranzo', 'info'], ['uscita', 'Uscita', '16:00, nonna Anna', 'acc']]
    };
  }
  function fatto(g, x) { return g[0] * 60 + g[1] <= x.min; }

  /* --- Oggi --- */
  function vOggi() {
    var x = giornata(), s = G.stile;
    var notaEd = '<div class="g-nota"><span class="g-av" aria-hidden="true">M</span><div><b>Maestra Marta</b><p>' + NOTA + '</p></div></div>';
    if (s === 'b') {
      return '<figure class="g-hero"><img src="img/aula.webp" width="1200" height="896" alt="L\'aula dei Pulcini vuota: tavolini bassi in legno, scaffali con giochi di legno, tappeto e finestre sul giardino">' +
        '<figcaption><span>' + cap(x.data) + '</span><h2>La giornata di Tommaso</h2></figcaption></figure>' +
        '<p class="g-hero-n">La stanza dei Pulcini. Per scelta non pubblichiamo foto dei bambini nell\'app.</p>' +
        '<blockquote class="g-cit"><p>«' + NOTA + '»</p><footer>Maestra Marta, sezione Pulcini</footer></blockquote>' +
        '<ol class="g-tl">' + GIORNATA.map(function (g) { var f = fatto(g, x); return '<li class="t-' + g[2] + (f ? '' : ' dopo') + '"><span class="g-tl-p">' + ic(g[2]) + '</span><div><time class="nx-num">' + hm(g) + (f ? '' : ' · in programma') + '</time><h3>' + g[3] + '</h3>' + (f ? '<p>' + g[4] + '</p>' : '') + '</div></li>'; }).join('') + '</ol>';
    }
    if (s === 'c') {
      var ultimi = x.fatti.slice(-3).reverse(), poi = GIORNATA.filter(function (g) { return !fatto(g, x); })[0];
      return '<p class="x-sotto">' + cap(x.data) + '</p>' +
        '<div class="g-tiles">' + x.sintesi.map(function (t) { return '<div class="g-tile t-' + t[3] + '"><span class="g-tile-ic">' + ic(t[0]) + '</span><small>' + t[1] + '</small><b>' + t[2] + '</b></div>'; }).join('') + '</div>' +
        '<div class="g-rapide"><button type="button" class="g-rap" data-a="assenza" data-nx-premi>' + ic('calok') + '<span>Avvisa un\'assenza</span></button>' +
        '<a class="g-rap" href="#/avvisi" data-nx-premi>' + ic('campana') + '<span>Avvisi da leggere</span><b class="g-rap-n">' + (daLeggere() || '0') + '</b></a>' +
        '<a class="g-rap" href="#/retta" data-nx-premi>' + ic('carta') + '<span>' + (st.pagato ? 'Retta pagata' : 'Paga la retta') + '</span></a></div>' +
        '<h2 class="x-h2">Ultimi aggiornamenti<small>' + x.fatti.length + ' di ' + GIORNATA.length + '</small></h2>' +
        '<ul class="nx-lista g-dia c">' + (ultimi.length ? ultimi.map(function (g) { return rigaDia(g, true); }).join('') : '<li><div class="nx-cella"><span class="nx-c-tx"><b>Ancora niente</b><small class="w">Il diario parte alle 8:10 con l\'entrata.</small></span></div></li>') + '</ul>' +
        (poi ? '<p class="x-nota">Prossimo: <b>' + poi[3].toLowerCase() + '</b> alle ' + hm(poi) + '.</p>' : '') +
        '<h2 class="x-h2" style="margin-top:24px">Dalla maestra</h2>' + notaEd;
    }
    return '<p class="x-sotto">' + cap(x.data) + (x.chiuso ? '' : ', aggiornata dalle educatrici') + '</p>' +
      '<div class="nx-gruppo"><ul class="nx-lista">' + x.sintesi.slice(0, 3).map(function (t) { return '<li><div class="nx-cella ic"><span class="nx-c-ic g-ic-' + t[3] + '">' + ic(t[0]) + '</span><span class="nx-c-tx"><b>' + t[1] + '</b></span><span class="nx-c-dx">' + t[2] + '</span></div></li>'; }).join('') + '</ul></div>' +
      '<p class="nx-gruppo-t">Diario</p><div class="nx-gruppo"><ul class="nx-lista g-dia">' + GIORNATA.map(function (g) { return rigaDia(g, fatto(g, x)); }).join('') + '</ul></div>' +
      notaEd +
      '<figure class="x-foto" style="margin-top:24px"><img src="img/aula.webp" width="1200" height="896" alt="L\'aula dei Pulcini vuota: tavolini bassi in legno, scaffali con giochi di legno, tappeto e finestre sul giardino" loading="lazy"><figcaption>La stanza dei Pulcini. Per scelta non pubblichiamo foto dei bambini nell\'app.</figcaption></figure>';
  }
  function rigaDia(g, f) {
    return '<li><div class="nx-cella ic t-' + g[2] + (f ? '' : ' dopo') + '"><span class="nx-c-ic">' + ic(g[2]) + '</span><span class="nx-c-tx"><b>' + g[3] + '</b><small class="w">' + (f ? g[4] : 'In programma') + '</small></span><span class="nx-c-dx nx-num">' + hm(g) + '</span></div></li>';
  }

  /* --- Avvisi --- */
  function vAvvisi() {
    var n = daLeggere(), l = AVV.filter(function (a) { return filtroAvv === 'tutti' || !st.risp[a.id]; });
    var h = '<div class="nx-chips g-filtri" role="group" aria-label="Filtra le comunicazioni"><button type="button" class="nx-chip" data-fa="da" aria-pressed="' + (filtroAvv === 'da') + '">Da leggere<em>' + n + '</em></button><button type="button" class="nx-chip" data-fa="tutti" aria-pressed="' + (filtroAvv === 'tutti') + '">Tutte<em>' + AVV.length + '</em></button></div>';
    if (!l.length) return h + NX.stato.vuoto('Tutto letto', 'Hai risposto a tutte le comunicazioni. Le nuove arrivano qui e sull\'icona in basso.', ['Vedi tutte', 'tutti']);
    return h + '<ul class="g-avv">' + l.map(function (a) {
      var r = st.risp[a.id], lab = r && a.az.filter(function (x) { return x[0] === r; })[0];
      return '<li class="x-card' + (r ? ' letto' : '') + '"><div class="g-avv-t"><span class="nx-pill ' + (r ? 'ok' : 'acc') + '">' + a.tag + '</span><span class="x-mini">' + a.d + '</span></div><h2>' + a.t + '</h2><p>' + a.p + '</p>' +
        (r ? '<p class="g-fatto">' + ic('ok') + 'Risposta inviata: ' + lab[1].toLowerCase() + '<button type="button" class="nx-btn t" data-cambia="' + a.id + '">Cambia</button></p>'
          : '<div class="g-avv-az">' + a.az.map(function (x, i) { return '<button type="button" class="nx-btn' + (i === 0 ? ' p' : '') + '" data-av="' + a.id + '" data-r="' + x[0] + '">' + x[1] + '</button>'; }).join('') + '</div>') + '</li>';
    }).join('') + '</ul>';
  }

  /* --- Menu --- */
  function lunedi() { var l = oggi(); l.setDate(l.getDate() - ((l.getDay() + 6) % 7)); if (!feriale(oggi())) l.setDate(l.getDate() + 7); return l; }
  function vMenu() {
    var lun = lunedi(), s = G.stile, m = MENU[menuG];
    var all = function (x) { return '<div class="g-all">' + x.a.map(function (y) { return '<span>' + y + '</span>'; }).join('') + '</div>'; };
    var dieta = '<div class="g-dieta"><span class="nx-pill acc">Dieta di Tommaso</span><p>Senza uovo. La cucina sostituisce da sola i piatti segnati.</p></div>';
    if (s === 'c') {
      return '<p class="x-sotto">Settimana dal ' + lun.getDate() + ' ' + MM[lun.getMonth()] + '. Oggi è evidenziato.</p><div class="g-sett">' + MENU.map(function (x, i) {
        var dd = new Date(lun); dd.setDate(lun.getDate() + i);
        return '<div class="g-sett-r' + (i === Math.min(4, Math.max(0, oggi().getDay() - 1)) && feriale(oggi()) ? ' oggi' : '') + '"><div class="g-sett-g"><b>' + GG[dd.getDay()].slice(0, 3) + '</b><span class="nx-num">' + dd.getDate() + '</span></div><div class="g-sett-p"><b>' + x.p + '</b><span>' + x.s + ' · ' + x.c + '</span><small>' + x.m + ' · ' + x.po + '</small>' + (x.sost ? '<em>' + x.sost + '</em>' : '') + '</div></div>';
      }).join('') + '</div>' + dieta;
    }
    var giorni = '<div class="x-giorni" role="group" aria-label="Giorno della settimana">' + ['lun', 'mar', 'mer', 'gio', 'ven'].map(function (n, i) { var dd = new Date(lun); dd.setDate(lun.getDate() + i); return '<button type="button" data-mg="' + i + '" aria-pressed="' + (i === menuG) + '"><small>' + n + '</small><b>' + dd.getDate() + '</b></button>'; }).join('') + '</div>';
    if (s === 'b') {
      return giorni + '<article class="g-pasti-b">' +
        '<section><p class="g-k">Merenda del mattino · 9:00</p><h2>' + m.m + '</h2></section>' +
        '<section><p class="g-k">Pranzo · 11:30</p><h2>' + m.p + '</h2><h2>' + m.s + '</h2><h2>' + m.c + '</h2>' + all(m) + (m.sost ? '<p class="g-sost">' + m.sost + '</p>' : '') + '</section>' +
        '<section><p class="g-k">Merenda del pomeriggio · 14:50</p><h2>' + m.po + '</h2></section></article>' + dieta;
    }
    return giorni + '<div style="height:16px"></div>' +
      '<p class="nx-gruppo-t">Merenda del mattino · 9:00</p><div class="nx-gruppo"><ul class="nx-lista"><li><div class="nx-cella"><span class="nx-c-tx"><b>' + m.m + '</b></span></div></li></ul></div>' +
      '<p class="nx-gruppo-t">Pranzo · 11:30</p><div class="nx-gruppo"><ul class="nx-lista">' + [['Primo', m.p], ['Secondo', m.s], ['Contorno', m.c]].map(function (r) { return '<li><div class="nx-cella"><span class="nx-c-tx"><small>' + r[0] + '</small><b class="w">' + r[1] + '</b></span></div></li>'; }).join('') + '</ul>' + all(m) + (m.sost ? '<p class="g-sost">' + m.sost + '</p>' : '') + '</div>' +
      '<p class="nx-gruppo-t">Merenda del pomeriggio · 14:50</p><div class="nx-gruppo"><ul class="nx-lista"><li><div class="nx-cella"><span class="nx-c-tx"><b>' + m.po + '</b></span></div></li></ul></div>' + dieta;
  }

  /* --- Presenze --- */
  function vPresenze() {
    var d0 = oggi(), y = d0.getFullYear(), mo = d0.getMonth(), primo = new Date(y, mo, 1), giorni = new Date(y, mo + 1, 0).getDate();
    var cal = '<div class="g-cal-gr">' + ['L', 'M', 'M', 'G', 'V', 'S', 'D'].map(function (w) { return '<span class="w" aria-hidden="true">' + w + '</span>'; }).join('');
    for (var v = 0; v < (primo.getDay() + 6) % 7; v++) cal += '<span></span>';
    var pres = 0, assM = 0;
    for (var g = 1; g <= giorni; g++) {
      var dd = new Date(y, mo, g, 12), c = '', lab = '';
      var avvisata = st.ass.some(function (a) { return a.y === y && a.m === mo && a.g === g; });
      if (!feriale(dd)) { c = 'c'; lab = 'chiuso'; }
      else if (dd < d0) { if (g % 9 === 4) { c = 'a'; assM++; lab = 'assente'; } else { c = 'p'; pres++; lab = 'presente'; } }
      else if (avvisata) { c = 'a'; lab = 'assenza avvisata'; }
      else if (+dd === +d0) { c = 'p'; pres++; lab = 'presente'; }
      cal += '<span class="' + c + (+dd === +d0 ? ' oggi' : '') + '" aria-label="' + g + ' ' + MM[mo] + (lab ? ', ' + lab : '') + '">' + g + '</span>';
    }
    cal += '</div>';
    var legenda = '<div class="g-leg"><span><i class="p"></i>presente</span><span><i class="a"></i>assente</span><span><i class="c"></i>chiuso</span></div>';
    var lista = st.ass.length ? '<ul class="nx-lista">' + st.ass.map(function (a, i) { return '<li><div class="nx-cella"><span class="nx-c-tx"><b>' + cap(GG[new Date(a.y, a.m, a.g).getDay()]) + ' ' + a.g + ' ' + MM[a.m] + '</b><small class="w">' + a.mot + (a.nota ? ' · ' + esc(a.nota) : '') + ' · avvisata alle ' + a.h + '</small></span><button type="button" class="nx-btn t r" data-annulla="' + i + '">Annulla</button></div></li>'; }).join('') + '</ul>'
      : '<p class="x-nota" style="margin-top:0">Nessuna assenza avvisata nei prossimi giorni.</p>';
    var bott = '<button type="button" class="nx-btn p pieno" data-a="assenza">' + ic('calok') + 'Avvisa un\'assenza</button>';
    var mese = cap(MM[mo]) + ' ' + y;
    if (G.stile === 'c') {
      return '<div class="g-num3"><div><b class="nx-num">' + pres + '</b><small>presenze</small></div><div><b class="nx-num">' + assM + '</b><small>assenze</small></div><div><b class="nx-num">' + st.ass.length + '</b><small>avvisate</small></div></div>' + bott +
        '<div class="x-card g-cal c" style="margin-top:16px"><p class="g-cal-t">' + mese + '</p>' + cal + legenda + '</div>' +
        '<h2 class="x-h2" style="margin-top:24px">Assenze avvisate</h2>' + lista;
    }
    if (G.stile === 'b') {
      return '<p class="g-grande">' + pres + ' giorni al nido a ' + MM[mo] + (assM ? ', ' + assM + ' a casa.' : '.') + '</p>' +
        '<div class="x-card g-cal b"><p class="g-cal-t">' + mese + '</p>' + cal + legenda + '</div>' +
        '<div style="margin:20px 0">' + bott + '</div><h2 class="x-h2">Assenze avvisate</h2>' + lista;
    }
    return '<div class="x-card g-cal"><p class="g-cal-t">' + mese + '</p>' + cal + legenda + '<p class="x-mini" style="margin-top:12px">' + pres + ' giorni di presenza e ' + assM + ' di assenza questo mese</p></div>' +
      '<div style="margin:20px 0 8px">' + bott + '</div><p class="nx-gruppo-t" style="margin-top:20px">Assenze avvisate</p>' + lista;
  }
  function foglioAssenza() {
    asSel = { g: null, m: null };
    var gb = '', k = 0, dd = oggi();
    while (k < 6) { dd.setDate(dd.getDate() + 1); if (!feriale(dd)) continue; var key = dd.getFullYear() + '-' + dd.getMonth() + '-' + dd.getDate(); gb += '<button type="button" data-ag="' + key + '" aria-pressed="false"><small>' + GG[dd.getDay()].slice(0, 3) + '</small><b>' + dd.getDate() + '</b></button>'; k++; }
    NX.foglio.apri({
      titolo: 'Avvisa un\'assenza',
      html: '<p class="x-lab" style="margin-top:4px">Giorno</p><div class="x-giorni" role="group" aria-label="Giorno di assenza">' + gb + '</div>' +
        '<p class="x-lab">Motivo</p><div class="nx-chips g-mot" role="group" aria-label="Motivo">' + MOT.map(function (m) { return '<button type="button" class="nx-chip" data-am="' + m + '" aria-pressed="false">' + m + '</button>'; }).join('') + '</div>' +
        '<label class="nx-campo" style="margin-top:18px"><span>Nota per le educatrici (facoltativa)</span><textarea id="g-as-nota" rows="2" maxlength="160" placeholder="Es. torna lunedì, ha ancora un po\' di tosse"></textarea></label>' +
        '<p class="x-err" id="g-as-err" role="alert"></p><p class="x-nota">Demo: l\'avviso resta in questo browser. Nella versione vera arriva alle educatrici della sezione.</p>',
      piede: '<button type="button" class="nx-btn p" data-a="ass-ok">Avvisa le educatrici</button>'
    });
  }

  /* --- Retta --- */
  function conto() {
    var d0 = oggi(), mo = d0.getMonth(), pasti = 0;
    for (var g = 1; g <= new Date(d0.getFullYear(), mo + 1, 0).getDate(); g++) { var x = new Date(d0.getFullYear(), mo, g, 12); if (feriale(x) && x <= d0 && g % 9 !== 4) pasti++; }
    return { mo: mo, pasti: pasti, imp: 520 + pasti * 4.5 };
  }
  var RIC = [['Ottobre', 598.5], ['Settembre', 565], ['Iscrizione', 120]];
  function ricevute() { var c = conto(), r = RIC.slice(); if (st.pagato) r.unshift([cap(MM[c.mo]), c.imp]); return r; }
  function vRetta() {
    var c = conto(), s = G.stile, mese = MM[c.mo];
    var box;
    if (st.pagato) box = '<div class="x-card g-retta pagata"><span class="nx-pill ok">Pagata</span><p class="x-mini">Retta di ' + mese + '</p><b class="g-imp nx-num">' + eur(c.imp) + '</b><p class="x-mini">Pagata con ' + (st.metodo === 'carta' ? 'carta' : 'addebito in conto') + '. La ricevuta è qui sotto.</p></div>';
    else box = '<div class="x-card g-retta"><span class="nx-pill wait">Da pagare entro il 30</span><p class="x-mini">Retta di ' + mese + '</p><b class="g-imp nx-num">' + eur(c.imp) + '</b>' +
      '<div class="x-righe" style="margin:14px 0 18px"><p><span>Quota fissa tempo pieno</span><span>520,00 €</span></p><p><span>Pasti (' + c.pasti + ' × 4,50 €)</span><span>' + eur(c.pasti * 4.5) + '</span></p></div>' +
      '<div class="nx-seg pieno g-met" role="group" aria-label="Metodo di pagamento"><button type="button" data-v="carta" aria-pressed="' + (st.metodo === 'carta') + '">Carta</button><button type="button" data-v="sepa" aria-pressed="' + (st.metodo === 'sepa') + '">Addebito in conto</button></div>' +
      '<button class="nx-btn p pieno" type="button" id="g-paga" style="margin-top:14px"' + (pagando ? ' disabled' : '') + '>' + (pagando ? '<span class="x-carica" aria-hidden="true"></span>Pagamento in corso…' : 'Paga ' + eur(c.imp)) + '</button>' +
      '<p class="x-nota">Demo: nessun pagamento vero. Nella versione vera si paga con il circuito della banca del nido.</p></div>';
    var ric = '<ul class="nx-lista">' + ricevute().map(function (r, i) { return '<li><button type="button" class="nx-cella ic" data-ric="' + i + '"><span class="nx-c-ic">' + ic('giu') + '</span><span class="nx-c-tx"><b>' + r[0] + '</b><small>ricevuta da scaricare</small></span><span class="nx-c-dx nx-num">' + eur(r[1]) + '</span></button></li>'; }).join('') + '</ul>' +
      '<button type="button" class="nx-btn pieno" data-a="csv" style="margin-top:12px">' + ic('giu') + 'Tutte le ricevute in un foglio (CSV)</button>';
    var bonus = '<p class="x-nota">Con le ricevute puoi chiedere il rimborso del bonus nido sul sito dell\'INPS.</p>';
    if (s === 'b') return '<figure class="g-hero corto"><img src="img/giardino.webp" width="800" height="597" alt="Il giardino del nido con la casetta di legno, la sabbiera, l\'orto nelle cassette e un grande albero"><figcaption><span>La retta comprende</span><h2>Uscite in giardino tutti i giorni, anche d\'inverno</h2></figcaption></figure>' + box + '<h2 class="x-h2" style="margin-top:28px">Ricevute</h2>' + ric + bonus;
    if (s === 'c') return box + '<h2 class="x-h2" style="margin-top:24px">Ricevute<small>' + ricevute().length + '</small></h2>' + ric + bonus;
    return box + '<p class="nx-gruppo-t" style="margin-top:28px">Ricevute</p>' + ric + bonus +
      '<figure class="x-foto" style="margin-top:24px"><img src="img/giardino.webp" width="800" height="597" alt="Il giardino del nido con la casetta di legno, la sabbiera, l\'orto nelle cassette e un grande albero" loading="lazy"><figcaption>Il giardino: la retta comprende uscite all\'aperto tutti i giorni, anche d\'inverno.</figcaption></figure>';
  }
  function scaricaRicevuta(i) {
    var r = ricevute()[i]; if (!r) return;
    var testo = 'Nido Il Gelso (attività inventata, documento di esempio)\r\nRicevuta: ' + r[0] + '\r\nBambino: Tommaso, sezione Pulcini\r\nImporto: ' + eur(r[1]) + '\r\n';
    var a = d.createElement('a'), u = URL.createObjectURL(new Blob([testo], { type: 'text/plain;charset=utf-8' }));
    a.href = u; a.download = 'ricevuta-' + r[0].toLowerCase() + '.txt'; d.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(u); a.remove(); }, 800);
    NX.toast('Ricevuta di ' + r[0].toLowerCase() + ' scaricata.');
  }

  /* --- eventi --- */
  d.addEventListener('click', function (e) {
    var b = e.target.closest('button,[data-a]'); if (!b || b.disabled) return;
    var a = b.getAttribute('data-a');
    if (a === 'assenza') foglioAssenza();
    else if (a === 'csv') { NX.csv.scarica('ricevute-nido-il-gelso.csv', [['Voce', 'Importo']].concat(ricevute().map(function (r) { return [r[0], r[1].toFixed(2).replace('.', ',')]; }))); NX.toast('Foglio delle ricevute scaricato.'); }
    else if (a === 'ass-ok') {
      var err = $('#g-as-err');
      if (!asSel.g || !asSel.m) { err.textContent = !asSel.g ? 'Scegli il giorno.' : 'Scegli il motivo: aiuta le educatrici a organizzarsi.'; return; }
      var k = asSel.g.split('-').map(Number), n = new Date();
      if (!st.ass.some(function (x) { return x.y === k[0] && x.m === k[1] && x.g === k[2]; })) st.ass.push({ y: k[0], m: k[1], g: k[2], mot: asSel.m, nota: ($('#g-as-nota').value || '').trim(), h: n.getHours() + ':' + ('0' + n.getMinutes()).slice(-2) });
      salva(); NX.foglio.chiudi(); NX.toast('Assenza avvisata alle educatrici.');
      if (G.v.id === 'presenze') G.aggiorna(); else G.vai('#/presenze');
    }
    else if (b.dataset.ag) { asSel.g = b.dataset.ag; $('#g-as-err').textContent = ''; $$('[data-ag]').forEach(function (x) { x.setAttribute('aria-pressed', x.dataset.ag === asSel.g); }); }
    else if (b.dataset.am) { asSel.m = b.dataset.am; $('#g-as-err').textContent = ''; $$('[data-am]').forEach(function (x) { x.setAttribute('aria-pressed', x.dataset.am === asSel.m); }); }
    else if (b.dataset.av) { st.risp[b.dataset.av] = b.dataset.r; salva(); NX.toast('Risposta inviata alle educatrici.'); G.aggiorna(); }
    else if (b.dataset.cambia) { delete st.risp[b.dataset.cambia]; filtroAvv = 'tutti'; salva(); G.aggiorna(); }
    else if (b.dataset.fa) { filtroAvv = b.dataset.fa; G.aggiorna(); }
    else if (b.dataset.mg) { menuG = +b.dataset.mg; G.aggiorna(); }
    else if (b.dataset.annulla) { st.ass.splice(+b.dataset.annulla, 1); salva(); NX.toast('Assenza annullata.', 'info'); G.aggiorna(); }
    else if (b.dataset.ric) scaricaRicevuta(+b.dataset.ric);
    else if (b.id === 'g-paga') {
      pagando = true; G.aggiorna();
      setTimeout(function () { pagando = false; st.pagato = true; salva(); if (G.v.id === 'retta') G.aggiorna(); NX.toast('Retta pagata. Ricevuta pronta.'); }, ridotto() ? 200 : 1300);
    }
  });

  G.avvia({
    nome: 'Il Gelso', sotto: 'asilo nido · app per i genitori',
    logo: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect width="48" height="48" rx="14" fill="var(--nx-tinta-pieno)"/><path d="M24 38V22" stroke="#fff" stroke-width="3" stroke-linecap="round"/><path d="M24 23.5c-9 0-12-6-10.6-11.6 6.6 0 10.6 4.2 10.6 11.6zM24 21c7.6 0 10.4-5.2 9-10.2-6.2 0-9 3.8-9 10.2z" fill="#fff"/></svg>',
    stili: { a: ['Classico', 'Liste raggruppate come le app di sistema: tutto in ordine, niente fronzoli.'], b: ['Diario', 'Foto grandi e la giornata raccontata come un diario, da leggere con calma.'], c: ['Rapido', 'Riquadri e azioni veloci: in una schermata vedi tutto e fai tutto.'] },
    nota: 'Attività inventata, dati di esempio. Le risposte, le assenze e il pagamento restano solo in questo browser.',
    descr: 'App per i genitori di un asilo nido inventato: diario della giornata, comunicazioni da firmare, menu con le diete, presenze e retta. Le scelte restano solo in questo browser.',
    destra: function () { return '<span class="g-av g-av-io" role="img" aria-label="Profilo: Tommaso, sezione Pulcini">T</span>'; },
    azione: function (k) { if (k === 'tutti') { filtroAvv = 'tutti'; G.aggiorna(); } },
    viste: [
      { id: 'oggi', nome: 'Oggi', ic: 'sole', tab: true, titolo: 'La giornata di Tommaso', corto: 'Oggi', render: vOggi, senzaTitolo: function (s) { return s === 'b'; } },
      { id: 'avvisi', nome: 'Avvisi', ic: 'campana', tab: true, titolo: 'Comunicazioni', render: vAvvisi },
      { id: 'menu', nome: 'Menu', ic: 'ciotola', tab: true, titolo: 'Menu della settimana', corto: 'Menu', render: vMenu, dopo: function () { centra($('#x-vista .x-giorni')); } },
      { id: 'presenze', nome: 'Presenze', ic: 'calok', tab: true, titolo: 'Presenze', render: vPresenze },
      { id: 'retta', nome: 'Retta', ic: 'carta', tab: true, titolo: 'Retta e pagamenti', corto: 'Retta', render: vRetta, dopo: function () { var m = $('#x-vista .g-met'); if (m) NX.seg(m, function (v) { st.metodo = v; salva(); }); } }
    ]
  });
  contaAvvisi();
})();
