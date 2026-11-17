/* Studio Arco - app dimostrativa sopra il kit Noxford. Nessun dato viene inviato: le scelte restano in questo browser. */
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

  /* ---------- Studio Arco, assistente vocale del centralino ----------
     La telefonata è simulata. L'assistente dice sempre all'inizio di essere un assistente automatico
     e passa a una persona quando glielo chiedono. */
  G.chiave = 'arco2-';
  I.incorso = '<path d="M6 3h4l2 5-3 2a11 11 0 005 5l2-3 5 2v4a2 2 0 01-2 2A17 17 0 014 5a2 2 0 012-2z"/>';
  I.lista = '<path d="M4 6h16M4 12h16M4 18h10"/>';
  I.regole = '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2.2"/><circle cx="9" cy="17" r="2.2"/>';
  I.persona = '<circle cx="12" cy="8" r="3.5"/><path d="M5 20c.7-4 3.4-6 7-6s6.3 2 7 6"/>';
  I.ripeti = '<path d="M4 12a8 8 0 0113.7-5.7L20 8.5M20 4v4.5h-4.5M20 12a8 8 0 01-13.7 5.7L4 15.5M4 20v-4.5h4.5"/>';
  I.avanti = '<path d="M6 5l10 7-10 7z"/>';

  var GG = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var giorno = function (k) { var x = new Date(); x.setHours(12, 0, 0, 0); x.setDate(x.getDate() + k); return x; };
  var prossimo = function (wd) { for (var k = 1; k < 9; k++) if (giorno(k).getDay() === wd) return k; return 2; };
  var kGio = prossimo(4), dGio = giorno(kGio);
  var APERTURA = 'Buongiorno, Studio Arco fisioterapia. <mark>Sono l\'assistente automatico dello studio, non una persona</mark>: posso fissare un appuntamento o darle informazioni. Se preferisce parlare con la segreteria, me lo dica quando vuole.';
  var COPIONE = [
    ['ai', APERTURA.replace(/<\/?mark>/g, '')],
    ['pz', 'Buongiorno, vorrei prenotare una visita, ho mal di schiena da una settimana.', { motivo: 'Mal di schiena da una settimana' }],
    ['ai', 'Mi dispiace. È la prima volta che viene da noi?'],
    ['pz', 'Sì, è la prima volta.', { tipo: 'Prima valutazione · 50 min · 60 €' }],
    ['ai', 'Per la prima valutazione servono 50 minuti e costa 60 euro. Ha una prescrizione del medico? Non è obbligatoria.'],
    ['pz', 'No, non ce l\'ho.', { pres: 'No, non serve' }],
    ['ai', 'Va bene lo stesso. Il primo posto libero è ' + GG[dGio.getDay()] + ' alle 15:30 con la dottoressa Neri, oppure venerdì alle 9 con il dottor Sala. Quale preferisce?'],
    ['pz', GG[dGio.getDay()].charAt(0).toUpperCase() + GG[dGio.getDay()].slice(1) + ' alle 15:30 va benissimo.', { quando: GG[dGio.getDay()] + ' ' + dGio.getDate() + ', 15:30 · dott.ssa Neri' }],
    ['ai', 'Perfetto. Mi dice nome e cognome?'],
    ['pz', 'Paola Ferretti.', { nome: 'Paola Ferretti' }],
    ['ai', 'Grazie, signora Ferretti. Le confermo ' + GG[dGio.getDay()] + ' ' + dGio.getDate() + ' alle 15:30 con la dottoressa Neri, sala 1. Le mando un SMS con l\'indirizzo. Porti una tuta comoda ed eventuali esami. Posso aiutarla in altro?'],
    ['pz', 'No, grazie, arrivederci.'],
    ['sis', 'Chiamata chiusa · appuntamento salvato in agenda', { fine: 1 }]
  ];
  var CH = [
    { id: 'c7', ora: '10:42', chi: '+39 333 ••• •• 07', es: 'app', dur: '1:35', t: 'Seduta di tecar per il ginocchio', r: ['Paziente già in cura, quarta seduta su sei', 'Spostata da mercoledì a venerdì alle 11', 'SMS di conferma inviato'], tr: [['ai', 'Buongiorno, Studio Arco. Sono l\'assistente automatico dello studio...'], ['pz', 'Devo spostare la seduta di mercoledì.'], ['ai', 'Certo. Venerdì alle 11 con il dottor Sala va bene?'], ['pz', 'Perfetto, grazie.']] },
    { id: 'c6', ora: '10:15', chi: '+39 347 ••• •• 51', es: 'inf', dur: '0:58', t: 'Domanda sul pavimento pelvico', r: ['Chiedeva se fate riabilitazione del pavimento pelvico', 'Risposto: sì, con la dottoressa Neri, il martedì e il giovedì', 'Non ha prenotato, richiamerà'], tr: [['ai', 'Buongiorno, Studio Arco. Sono l\'assistente automatico dello studio...'], ['pz', 'Fate riabilitazione del pavimento pelvico?'], ['ai', 'Sì, la segue la dottoressa Neri il martedì e il giovedì. Vuole che le cerchi un posto?'], ['pz', 'Ci penso e richiamo, grazie.']] },
    { id: 'c5', ora: '9:48', chi: '+39 320 ••• •• 33', es: 'pas', dur: '0:41', t: 'Voleva parlare con una persona', r: ['Ha chiesto subito della segreteria', 'Passata a Sara in 4 secondi'], tr: [['ai', 'Buongiorno, Studio Arco. Sono l\'assistente automatico dello studio...'], ['pz', 'Preferisco parlare con qualcuno.'], ['ai', 'Certo, la passo subito alla segreteria.']] },
    { id: 'c4', ora: '9:20', chi: '+39 349 ••• •• 92', es: 'ric', dur: '1:12', t: 'Dolore forte dopo una caduta', r: ['Caduta ieri, dolore forte al polso', 'L\'assistente ha consigliato di farsi vedere da un medico prima della fisioterapia', 'Chiesto alla segreteria di richiamare domani'], tr: [['ai', 'Buongiorno, Studio Arco. Sono l\'assistente automatico dello studio...'], ['pz', 'Sono caduta ieri e il polso mi fa molto male.'], ['ai', 'Con un dolore forte dopo una caduta è meglio farsi vedere da un medico o al pronto soccorso. Io non posso dare consigli medici. Vuole che la segreteria la richiami domani?'], ['pz', 'Sì, grazie.']] },
    { id: 'c3', ora: '8:55', chi: '+39 338 ••• •• 14', es: 'app', dur: '1:48', t: 'Prima visita per cervicale', r: ['Nuovo paziente, cervicale', 'Prenotato lunedì alle 17 con il dottor Sala'], tr: [['ai', 'Buongiorno, Studio Arco. Sono l\'assistente automatico dello studio...'], ['pz', 'Vorrei una visita per la cervicale.'], ['ai', 'Lunedì alle 17 con il dottor Sala, le va bene?'], ['pz', 'Sì.']] },
    { id: 'c2', ora: '8:31', chi: '+39 340 ••• •• 60', es: 'inf', dur: '0:37', t: 'Orari del sabato', r: ['Chiedeva gli orari del sabato', 'Risposto: dalle 9 alle 13'], tr: [['ai', 'Buongiorno, Studio Arco. Sono l\'assistente automatico dello studio...'], ['pz', 'Siete aperti il sabato?'], ['ai', 'Sì, dalle 9 alle 13.']] },
    { id: 'c1', ora: '7:52', chi: '+39 366 ••• •• 28', es: 'ric', dur: '0:29', t: 'Chiamata prima dell\'apertura', r: ['Ha lasciato nome e numero', 'Da richiamare dopo le 9'], tr: [['ai', 'Buongiorno, Studio Arco. Sono l\'assistente automatico dello studio. Lo studio apre alle 8:30...'], ['pz', 'Mi richiamate? Sono Bruno.']] }
  ];
  var ES = { app: ['Appuntamento', 'ok'], ric: ['Da richiamare', 'wait'], inf: ['Informazioni', 'info'], pas: ['Passata a una persona', 'acc'] };
  var FIL = [['tutte', 'Tutte'], ['app', 'Appuntamenti'], ['ric', 'Da richiamare'], ['inf', 'Informazioni'], ['pas', 'Segreteria']];
  var AG = [
    [1, '9:00', 'Marco Bellini', 'Tecar ginocchio · dott. Sala', 'seg'], [1, '11:30', 'Lucia Moro', 'Massoterapia · dott.ssa Neri', 'ai'], [1, '17:00', 'Gianni Rota', 'Prima valutazione cervicale · dott. Sala', 'ai'],
    [kGio, '10:00', 'Anna Greco', 'Pavimento pelvico · dott.ssa Neri', 'seg'], [kGio, '14:30', 'Piero Villa', 'Rieducazione spalla · dott. Sala', 'ai'],
    [prossimo(5), '9:00', 'Elena Costa', 'Linfodrenaggio · dott.ssa Neri', 'seg'], [prossimo(5), '11:00', 'Davide Fumagalli', 'Tecar ginocchio, spostata · dott. Sala', 'ai']
  ];
  var REG = [['auto', 'Dice sempre che è un assistente automatico', 'all\'inizio di ogni chiamata', 1, 1], ['umano', 'Passa a una persona quando lo chiedono', 'oppure dopo due risposte non capite', 1, 1], ['medico', 'Non dà consigli medici', 'per un dolore forte consiglia il medico o il 112', 1, 1], ['app', 'Prende e sposta appuntamenti', 'solo negli orari liberi dell\'agenda', 1, 0], ['sms', 'Manda un SMS di conferma', 'con indirizzo e cosa portare', 1, 0], ['fuori', 'Risponde quando lo studio è chiuso', 'la sera e la domenica', 1, 0], ['reg', 'Registra la chiamata', 'solo se la persona dice di sì', 0, 0]];
  var SA = [['Orari', 'lun–ven 8:30–19:30, sabato 9–13'], ['Servizi e prezzi', 'prima valutazione 60 €, seduta 45 €, tecar 35 €, pacchetto 10 sedute 400 €'], ['Terapisti', 'dott.ssa Neri (pavimento pelvico, linfodrenaggio), dott. Sala (sport, ortopedia)'], ['Indirizzo', 'via dei Platani 14 (di esempio), parcheggio nel cortile']];
  var st = mem.get('stato', { fatta: false, reg: {}, rich: {} });
  st.rich = st.rich || {};
  var fil = 'tutte', agG = 1, tick = null, passo = 0, sec = 0, cap = {}, righe = [], finita = false;
  var mmss = function (s) { return ('0' + Math.floor(s / 60)).slice(-2) + ':' + ('0' + s % 60).slice(-2); };
  var salva = function () { mem.set('stato', st); G.badge('chiamate', daRichiamare()); };
  function tutte() {
    var l = CH.slice();
    if (st.fatta) l.unshift({ id: 'live', ora: 'adesso', chi: '+39 347 ••• •• 18', es: 'app', dur: '1:52', t: 'Prima valutazione per mal di schiena', r: ['Nuova paziente: Paola Ferretti', 'Prenotata ' + GG[dGio.getDay()] + ' ' + dGio.getDate() + ' alle 15:30 con la dott.ssa Neri', 'SMS di conferma inviato'], tr: COPIONE.filter(function (x) { return x[0] !== 'sis'; }).map(function (x) { return [x[0], x[1]]; }) });
    return l;
  }
  var daRichiamare = function () { return CH.filter(function (c) { return c.es === 'ric' && !st.rich[c.id]; }).length; };

  /* --- Chiamata in corso (simulata) --- */
  function riga(l, scrive) {
    if (l[0] === 'sis') return '<li class="a-sis">' + esc(l[1]) + '</li>';
    return '<li class="a-' + l[0] + (scrive ? ' scrive' : '') + '"><small>' + (l[0] === 'ai' ? 'Assistente automatico' : 'Paziente') + '</small>' + (scrive ? '<span class="a-dots" aria-label="sta parlando"><i></i><i></i><i></i></span>' : '<p>' + esc(l[1]) + '</p>') + '</li>';
  }
  function campiCapito() { return [['Motivo', cap.motivo], ['Tipo di visita', cap.tipo], ['Prescrizione', cap.pres], ['Quando', cap.quando], ['Nome', cap.nome]]; }
  function htmlCapito() {
    var s = G.stile, R = campiCapito();
    var esito = cap.fine && cap.nome ? '<p class="a-esito ok">' + ic('ok') + 'Appuntamento salvato in agenda, SMS di conferma pronto.</p>' : cap.umano ? '<p class="a-esito acc">' + ic('persona') + 'Passata alla segreteria: Sara vede già cosa ha detto il paziente.</p>' : '';
    if (s === 'c') return '<div class="a-cap-g">' + R.map(function (r) { return '<div' + (r[1] ? ' class="si"' : '') + '><small>' + r[0] + '</small><b>' + (r[1] || 'in ascolto…') + '</b></div>'; }).join('') + '</div>' + esito;
    return '<ul class="nx-lista a-cap">' + R.map(function (r) { return '<li><div class="nx-cella"><span class="nx-c-tx"><small>' + r[0] + '</small><b class="w' + (r[1] ? '' : ' vuoto') + '">' + (r[1] || 'in ascolto…') + '</b></span>' + (r[1] ? '<span class="a-spunta">' + ic('ok') + '</span>' : '') + '</div></li>'; }).join('') + '</ul>' + esito;
  }
  function htmlTrasc() { var h = righe.map(function (l) { return riga(l); }).join(''); if (!finita && passo < COPIONE.length && passo > 0) h += riga(COPIONE[passo], true); return h; }
  function onda() { var h = ''; for (var i = 0; i < 24; i++) h += '<i style="animation-delay:' + ((i * 37) % 9) * 0.11 + 's"></i>'; return '<div class="a-onda' + (finita ? ' ferma' : '') + '" aria-hidden="true">' + h + '</div>'; }
  function vChiamata() {
    var s = G.stile, stato = finita ? (cap.umano ? 'Passata alla segreteria' : 'Chiamata terminata') : 'Chiamata in corso';
    var testa = '<div class="a-call' + (finita ? ' fine' : '') + '"><p class="a-kick"><i></i><span id="a-stato">' + stato + '</span></p><h2 class="nx-num">+39 347 ••• •• 18</h2><p class="a-tempo"><span class="nx-num" id="a-tempo">' + mmss(sec) + '</span> · risponde l\'assistente automatico</p>' + onda() + '</div>';
    var az = '<div class="a-az">' + (ridotto() && !finita ? '<button class="nx-btn p" type="button" id="a-avanti">' + ic('avanti') + 'Avanti nella chiamata</button>' : '') +
      '<button class="nx-btn" type="button" id="a-umano"' + (finita ? ' disabled' : '') + '>' + ic('persona') + 'Passa a una persona</button><button class="nx-btn" type="button" id="a-rifai">' + ic('ripeti') + 'Riascolta da capo</button></div>';
    var nota = '<p class="x-nota">Demo: la telefonata è simulata. Nella versione vera l\'assistente risponde al numero dello studio quando la segreteria è occupata o chiusa, e lo dice sempre all\'inizio.</p>';
    var trasc = '<ol class="a-trasc" id="a-trasc" aria-live="polite">' + htmlTrasc() + '</ol>';
    var capito = '<div id="a-capito" aria-live="polite">' + htmlCapito() + '</div>';
    if (s === 'b') return testa + '<h2 class="a-h">La conversazione</h2>' + trasc + '<h2 class="a-h">Cosa ha capito</h2>' + capito + az + nota;
    if (s === 'c') {
      var l = tutte();
      return '<div class="a-kpi3"><div><b class="nx-num">' + l.length + '</b><small>oggi</small></div><div><b class="nx-num">' + l.filter(function (c) { return c.es === 'app'; }).length + '</b><small>appuntamenti</small></div><div><b class="nx-num">' + daRichiamare() + '</b><small>da richiamare</small></div></div>' +
        testa + '<p class="x-lab">Cosa ha capito</p>' + capito + az + '<p class="x-lab">Trascrizione</p>' + trasc + nota;
    }
    return testa + '<p class="nx-gruppo-t" style="margin-top:22px">Cosa ha capito l\'assistente</p>' + capito + '<p class="nx-gruppo-t" style="margin-top:24px">Trascrizione dal vivo</p>' + trasc + az + nota;
  }
  function ridisegnaChiamata() {
    var t = $('#a-trasc'); if (!t) return;
    t.innerHTML = htmlTrasc(); $('#a-capito').innerHTML = htmlCapito(); $('#a-tempo').textContent = mmss(sec);
  }
  function avanza() {
    if (passo >= COPIONE.length) return fine();
    var l = COPIONE[passo++]; if (l[2]) Object.keys(l[2]).forEach(function (k) { cap[k] = l[2][k]; });
    righe.push(l);
    sec += l[0] === 'sis' ? 0 : 6 + Math.round(l[1].length / 12);
    if (cap.fine) return fine();
    ridisegnaChiamata();
  }
  function fine() {
    clearInterval(tick); tick = null; finita = true;
    if (cap.nome && !st.fatta) { st.fatta = true; salva(); }
    if (G.v && G.v.id === 'chiamata') G.aggiorna();
  }
  function avviaChiamata() {
    clearInterval(tick); tick = null; passo = 0; sec = 0; cap = {}; righe = []; finita = false;
    if (ridotto()) { while (passo < 8) avanza(); return; }
    avanza(); tick = setInterval(function () { if (G.v.id === 'chiamata') avanza(); }, 2200);
  }
  function umano() {
    clearInterval(tick); tick = null;
    righe.push(['pz', 'Posso parlare con qualcuno della segreteria?'], ['ai', 'Certo, la passo subito alla segreteria. Resti in linea, per favore.'], ['sis', 'Trasferita a Sara, segreteria · le note della chiamata sono già sul suo schermo']);
    cap.umano = 1; finita = true; G.aggiorna(); NX.toast('Chiamata passata alla segreteria.');
  }

  /* --- Chiamate --- */
  function vChiamate() {
    var l = tutte(), s = G.stile, n = function (e) { return l.filter(function (c) { return c.es === e; }).length; };
    var vis = l.filter(function (c) { return fil === 'tutte' || c.es === fil; });
    var kpi = '<div class="a-kpi"><div><b class="nx-num">' + l.length + '</b><small>chiamate da stamattina</small></div><div><b class="nx-num">' + n('app') + '</b><small>appuntamenti presi o spostati</small></div><div><b class="nx-num">' + daRichiamare() + '</b><small>da richiamare</small></div></div>';
    var chips = '<div class="nx-chips a-fil" role="group" aria-label="Filtra per esito">' + FIL.map(function (f) { return '<button type="button" class="nx-chip" data-fil="' + f[0] + '" aria-pressed="' + (f[0] === fil) + '">' + f[1] + '</button>'; }).join('') + '</div>';
    var CORTI = { app: 'Preso', ric: 'Richiama', inf: 'Info', pas: 'Persona' };
    var pill = function (c) { var e = c.es === 'ric' && st.rich[c.id] ? ['Richiamato', 'ok'] : ES[c.es]; return '<span class="nx-pill ' + e[1] + '">' + (s === 'c' ? (c.es === 'ric' && st.rich[c.id] ? 'Fatto' : CORTI[c.es]) : e[0]) + '</span>'; };
    var lista;
    if (!vis.length) lista = NX.stato.vuoto('Nessuna chiamata', 'Nessuna chiamata con questo esito, per oggi.', ['Vedi tutte', 'tutte']);
    else if (s === 'b') lista = '<ul class="a-cards">' + vis.map(function (c) { return '<li><a class="x-card" href="#/dettaglio/' + c.id + '" data-nx-premi><span class="a-cards-t">' + pill(c) + '<span class="x-mini nx-num">' + c.ora + ' · ' + c.dur + '</span></span><h3>' + c.t + '</h3><p>' + c.r[c.r.length - 1] + '</p></a></li>'; }).join('') + '</ul>';
    else if (s === 'c') lista = '<div class="a-tab" role="list">' + vis.map(function (c) { return '<a role="listitem" href="#/dettaglio/' + c.id + '" class="a-tr"><span class="a-tr-o nx-num">' + c.ora + '</span><span class="a-tr-t"><b>' + c.t + '</b><small class="nx-num">' + c.chi + ' · ' + c.dur + '</small></span>' + pill(c) + '</a>'; }).join('') + '</div>';
    else lista = '<ul class="nx-lista">' + vis.map(function (c) { return '<li><a class="nx-cella a-cel" href="#/dettaglio/' + c.id + '"><span class="nx-c-tx"><b>' + c.t + '</b><small class="nx-num">' + c.ora + ' · ' + c.chi + ' · ' + c.dur + '</small>' + pill(c) + '</span><i class="nx-chev"></i></a></li>'; }).join('') + '</ul>';
    return (s === 'c' ? '' : kpi) + chips + lista + (s === 'c' ? '<p class="x-nota">' + l.length + ' chiamate oggi · ' + daRichiamare() + ' da richiamare.</p>' : '');
  }
  function vDettaglio(id) {
    var c = tutte().filter(function (x) { return x.id === id; })[0];
    if (!c) return NX.stato.errore('Chiamata non trovata', 'Questa chiamata non è più nell\'elenco di oggi.', ['Torna alle chiamate', 'lista']);
    var e = c.es === 'ric' && st.rich[c.id] ? ['Richiamato', 'ok'] : ES[c.es];
    return '<span class="nx-pill ' + e[1] + '">' + e[0] + '</span><h2 class="a-d-tit">' + c.t + '</h2><p class="x-mini nx-num">Oggi ' + (c.ora === 'adesso' ? 'adesso' : 'alle ' + c.ora) + ' · ' + c.chi + ' · durata ' + c.dur + '</p>' +
      '<div class="x-card a-riass"><b>Riassunto per la segreteria</b><ul>' + c.r.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul></div>' +
      (c.es === 'ric' ? (st.rich[c.id] ? '<p class="a-esito ok">' + ic('ok') + 'Richiamato alle ' + st.rich[c.id] + '</p>' : '<button class="nx-btn p pieno" type="button" data-ric="' + c.id + '" style="margin-top:14px">' + ic('incorso') + 'Segna come richiamato</button>') : '') +
      '<p class="x-lab" style="margin-top:24px">Trascrizione</p><ol class="a-trasc">' + c.tr.map(function (l) { return riga(l); }).join('') + '</ol>';
  }

  /* --- Agenda --- */
  function vAgenda() {
    var g = '', k = 0, n = 0;
    while (n < 6) { k++; var dd = giorno(k); if (dd.getDay() === 0) continue; g += '<button type="button" data-ag="' + k + '" aria-pressed="' + (k === agG) + '"><small>' + GG[dd.getDay()].slice(0, 3) + '</small><b>' + dd.getDate() + '</b></button>'; n++; }
    var l = AG.filter(function (a) { return a[0] === agG; });
    if (st.fatta && agG === kGio) l = l.concat([[kGio, '15:30', 'Paola Ferretti', 'Prima valutazione schiena · dott.ssa Neri, sala 1', 'ai', 1]]);
    l.sort(function (a, b) { return parseFloat(a[1].replace(':', '.')) - parseFloat(b[1].replace(':', '.')); });
    var s = G.stile, nAi = l.filter(function (a) { return a[4] === 'ai'; }).length;
    var lista = !l.length ? '<div class="x-card">' + NX.stato.vuoto('Giornata libera', 'Nessun appuntamento preso per telefono in questo giorno.') + '</div>'
      : '<ul class="a-ag ' + s + '">' + l.map(function (a) { return '<li' + (a[5] ? ' class="nuovo"' : '') + '><span class="a-ag-o nx-num">' + a[1] + '</span><span class="a-ag-t"><b>' + a[2] + '</b><small>' + a[3] + '</small><span class="nx-pill ' + (a[4] === 'ai' ? 'acc' : '') + '">' + (a[4] === 'seg' ? 'dalla segreteria' : 'dall\'assistente' + (a[5] ? ' · appena ora' : '')) + '</span></span></li>'; }).join('') + '</ul>';
    var foto = '<figure class="x-foto" style="margin-top:24px"><img src="img/sala.webp" width="1200" height="896" alt="Sala di fisioterapia con lettino, spalliera in legno, elastici colorati e una grande finestra" loading="lazy"><figcaption>La sala 1. L\'assistente sa quali sale e quali terapisti sono liberi.</figcaption></figure>';
    return '<div class="x-giorni" role="group" aria-label="Giorno">' + g + '</div><p class="x-nota" style="margin:12px 4px 16px">' + l.length + (l.length === 1 ? ' appuntamento' : ' appuntamenti') + ', ' + nAi + ' presi dall\'assistente.</p>' + lista + (s === 'c' ? '' : foto);
  }

  /* --- Regole --- */
  function vRegole() {
    var s = G.stile;
    var apertura = '<div class="x-card a-apertura"><p class="a-k">Frase di apertura</p><p class="a-frase">' + APERTURA + '</p><p class="x-mini">' + ic('ok') + 'La parte "sono l\'assistente automatico" non si può togliere.</p></div>';
    var regole = '<ul class="nx-lista">' + REG.map(function (r) {
      var on = r[4] ? true : (st.reg[r[0]] !== undefined ? st.reg[r[0]] : !!r[3]);
      return '<li><label class="nx-cella x-tg' + (r[4] ? ' fisso' : '') + '"><span class="nx-c-tx"><b class="w">' + r[1] + '</b><small class="w">' + r[2] + (r[4] ? ' · sempre attiva' : '') + '</small></span><span class="nx-toggle"><input type="checkbox" data-reg="' + r[0] + '"' + (on ? ' checked' : '') + (r[4] ? ' disabled' : '') + ' aria-label="' + r[1] + '"><i></i></span></label></li>';
    }).join('') + '</ul>';
    var sa = '<ul class="nx-lista">' + SA.map(function (x) { return '<li><div class="nx-cella"><span class="nx-c-tx"><small>' + x[0] + '</small><b class="w a-sa">' + x[1] + '</b></span></div></li>'; }).join('') + '</ul>';
    if (s === 'b') return '<figure class="a-hero"><img src="img/reception.webp" width="1200" height="896" alt="La reception dello studio con bancone in legno chiaro, telefono, tablet e poltroncine verdi"></figure>' + apertura + '<h2 class="a-h">Le regole</h2>' + regole + '<h2 class="a-h">Cosa sa dello studio</h2>' + sa;
    if (s === 'c') return apertura + '<p class="x-lab">Regole</p>' + regole + '<p class="x-lab">Cosa sa dello studio</p>' + sa;
    return apertura + '<p class="nx-gruppo-t" style="margin-top:24px">Regole</p>' + regole + '<p class="nx-gruppo-t" style="margin-top:24px">Cosa sa dello studio</p>' + sa +
      '<figure class="x-foto" style="margin-top:24px"><img src="img/reception.webp" width="1200" height="896" alt="La reception dello studio con bancone in legno chiaro, telefono, tablet e poltroncine verdi" loading="lazy"><figcaption>La reception: quando l\'assistente passa una chiamata, qui arrivano le note.</figcaption></figure>';
  }

  /* --- eventi --- */
  d.addEventListener('change', function (e) {
    var k = e.target.getAttribute && e.target.getAttribute('data-reg'); if (!k) return;
    st.reg[k] = e.target.checked; salva(); NX.toast(e.target.checked ? 'Regola attivata.' : 'Regola spenta.', e.target.checked ? '' : 'info');
  });
  d.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b || b.disabled) return;
    if (b.id === 'a-umano') umano();
    else if (b.id === 'a-avanti') { avanza(); if (finita) G.aggiorna(); }
    else if (b.id === 'a-rifai') { avviaChiamata(); G.aggiorna(); }
    else if (b.dataset.fil) { fil = b.dataset.fil; G.aggiorna(); }
    else if (b.dataset.ag) { agG = +b.dataset.ag; G.aggiorna(); }
    else if (b.dataset.ric) { var n = new Date(); st.rich[b.dataset.ric] = n.getHours() + ':' + ('0' + n.getMinutes()).slice(-2); salva(); G.aggiorna(); NX.toast('Segnato come richiamato.'); }
  });

  G.avvia({
    nome: 'Studio Arco', sotto: 'assistente del centralino',
    logo: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect width="48" height="48" rx="14" fill="var(--nx-tinta-pieno)"/><path d="M12 35a12 12 0 0124 0" fill="none" stroke="#fff" stroke-width="3.6" stroke-linecap="round"/><circle cx="24" cy="17" r="4.5" fill="#fff"/></svg>',
    stili: { a: ['Classico', 'Liste e bolle come nelle app di sistema: la chiamata, cosa ha capito, la trascrizione.'], b: ['Dialogo', 'La telefonata si legge come un\'intervista: testo grande, foto dello studio, schede ampie.'], c: ['Centralino', 'Per la segreteria: numeri del giorno in alto, campi in griglia, elenco fitto delle chiamate.'] },
    nota: 'Attività inventata, chiamate e pazienti di esempio. La telefonata è simulata e le regole restano solo in questo browser.',
    descr: 'App di un assistente vocale per uno studio di fisioterapia inventato: chiamata simulata con trascrizione, riepilogo per la segreteria, appuntamenti presi e regole. L\'assistente dice sempre di essere automatico.',
    destra: function () { return '<span class="nx-pill ok a-on">Attivo</span>'; },
    azione: function (k) { if (k === 'tutte') { fil = 'tutte'; G.aggiorna(); } else if (k === 'lista') G.vai('#/chiamate'); },
    viste: [
      { id: 'chiamata', nome: 'In corso', ic: 'incorso', tab: true, titolo: 'Chiamata', render: vChiamata, senzaTitolo: function (s) { return s !== 'a'; } },
      { id: 'chiamate', nome: 'Chiamate', ic: 'lista', tab: true, titolo: 'Chiamate di oggi', corto: 'Chiamate', render: vChiamate },
      { id: 'dettaglio', nome: 'Dettaglio', di: 'chiamate', indietro: ['#/chiamate', 'Chiamate'], titolo: 'Dettaglio', render: vDettaglio, senzaTitolo: function () { return true; } },
      { id: 'agenda', nome: 'Agenda', ic: 'cal', tab: true, titolo: 'Appuntamenti presi', corto: 'Agenda', render: vAgenda, dopo: function () { centra($('#x-vista .x-giorni')); } },
      { id: 'regole', nome: 'Regole', ic: 'regole', tab: true, titolo: 'Cosa dice e cosa fa', corto: 'Regole', render: vRegole }
    ]
  });
  G.badge('chiamate', daRichiamare());
  avviaChiamata(); if (G.v.id === 'chiamata') G.aggiorna();
})();
