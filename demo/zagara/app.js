/* Zagara - app dimostrativa. Nessun dato viene inviato: vassoio e ordini restano nel browser. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var euro = function (n) { return n.toFixed(2).replace('.', ',') + ' €'; };
  var esc = function (t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var mem = {
    get: function (k, d) { try { var v = localStorage.getItem('zagara-' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('zagara-' + k, JSON.stringify(v)); } catch (e) {} }
  };
  var ILL = {
    cornetto: '<svg viewBox="0 0 64 64"><path d="M8 40c6-16 42-16 48 0-6 6-42 6-48 0z" fill="#E5A65A"/><path d="M20 30l3 12M32 27v15M44 30l-3 12" stroke="#B9772F" stroke-width="2"/></svg>',
    tazza: '<svg viewBox="0 0 64 64"><path d="M14 26h30v10a15 15 0 0 1-30 0z" fill="#fff" stroke="#4A2C22" stroke-width="2"/><path d="M44 29h4a5 5 0 0 1 0 10h-5" fill="none" stroke="#4A2C22" stroke-width="2"/><ellipse cx="29" cy="26" rx="15" ry="3" fill="#B27B52"/></svg>',
    torta: '<svg viewBox="0 0 64 64"><rect x="12" y="28" width="40" height="20" rx="3" fill="#F6E1DF" stroke="#4A2C22" stroke-width="2"/><path d="M12 34c5 4 9-4 14 0s9-4 14 0 9-4 12 0" fill="none" stroke="#9DB46C" stroke-width="3"/><circle cx="32" cy="22" r="4" fill="#C9473A"/></svg>',
    mignon: '<svg viewBox="0 0 64 64"><circle cx="22" cy="36" r="10" fill="#F2D19B"/><circle cx="42" cy="36" r="10" fill="#E9B9B3"/><circle cx="32" cy="24" r="9" fill="#9DB46C"/></svg>',
    bicchiere: '<svg viewBox="0 0 64 64"><path d="M20 14h24l-4 38H24z" fill="#FFE3A3" stroke="#4A2C22" stroke-width="2"/></svg>'
  };
  var CAT = [['colazione', 'Colazione'], ['pasticceria', 'Pasticceria'], ['torte', 'Torte'], ['bar', 'Caffetteria']];
  var MENU = [
    { id: 'cornetto', c: 'colazione', n: 'Cornetto vuoto', d: 'Burro, lievitazione di 18 ore.', p: 1.2, ill: 'cornetto', fresco: 1 },
    { id: 'cornpist', c: 'colazione', n: 'Cornetto al pistacchio', d: 'Crema al pistacchio di Sicilia e granella.', p: 1.8, img: 'img/vetrina.webp', fresco: 1 },
    { id: 'cornmarm', c: 'colazione', n: 'Cornetto all\'albicocca', d: 'Confettura fatta da noi.', p: 1.4, ill: 'cornetto' },
    { id: 'colaz', c: 'colazione', n: 'Colazione al banco', d: 'Cappuccino e cornetto a scelta.', p: 3, img: 'img/colazione.webp', fresco: 1 },
    { id: 'cannolo', c: 'pasticceria', n: 'Cannolo siciliano', d: 'Ricotta di pecora, riempito al momento.', p: 3, img: 'img/cannoli.webp', fresco: 1 },
    { id: 'mignon', c: 'pasticceria', n: 'Vassoio di mignon', d: 'Bignè, crostatine, cannolicchi: scegli quanti pezzi.', p: 1.3, ill: 'mignon', unita: 'al pezzo' },
    { id: 'crostata', c: 'pasticceria', n: 'Crostatina ai frutti di bosco', d: 'Frolla al burro e crema pasticcera.', p: 2.5, ill: 'mignon' },
    { id: 'torta', c: 'torte', n: 'Torta su ordinazione', d: 'Pan di Spagna, crema e frutta, con la tua scritta. Pronta in 48 ore.', p: 0, ill: 'torta', torta: 1 },
    { id: 'cassata', c: 'torte', n: 'Cassata', d: 'Ricotta, pan di Spagna, pasta reale e frutta candita.', p: 0, ill: 'torta', torta: 1, gusto: 'Classica' },
    { id: 'caffe', c: 'bar', n: 'Caffè', d: 'Miscela 80% arabica.', p: 1.1, ill: 'tazza' },
    { id: 'cappuccino', c: 'bar', n: 'Cappuccino', d: 'Anche con latte di avena.', p: 1.6, ill: 'tazza' },
    { id: 'spremuta', c: 'bar', n: 'Spremuta d\'arancia', d: 'Arance di stagione.', p: 3.5, ill: 'bicchiere' }
  ];
  var MISURE = [['6', '6 persone', 24], ['10', '10 persone', 38], ['16', '16 persone', 58]];
  var GUSTI = [['Crema e frutti di bosco', 0], ['Chantilly e cioccolato', 0], ['Pistacchio', 4], ['Ricotta e pere', 2]];
  var st = mem.get('stato', { modo: 'asporto', slot: null, ordini: [] });
  var cart = mem.get('vassoio', []);
  var cat = 'colazione';
  var byId = function (id) { return MENU.filter(function (m) { return m.id === id; })[0]; };
  var th = function (m, cls) { return m.img ? '<img class="th ' + (cls || '') + '" src="' + m.img + '" alt="" loading="lazy" width="300" height="300">' : '<span class="th ' + (cls || '') + '" aria-hidden="true">' + ILL[m.ill] + '</span>'; };
  var prezzoDa = function (m) { return m.torta ? 'da ' + euro(MISURE[0][2]) : euro(m.p) + (m.unita ? ' ' + m.unita : ''); };
  function toast(t) { var el = $('#toast'); el.textContent = t; el.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(function () { el.classList.remove('on'); }, 2400); }
  function salva() { mem.set('vassoio', cart); mem.set('stato', st); var n = cart.reduce(function (a, r) { return a + r.q; }, 0); $('#badge').hidden = !n; $('#badge').textContent = n; }
  function aperto() { var h = new Date().getHours(); $('#ora-aperto').innerHTML = h >= 6 && h < 20 ? 'Aperto<br>fino alle 20' : 'Chiuso<br>apre alle 6:00'; }

  function home() { $('#home-row').innerHTML = MENU.filter(function (m) { return m.fresco; }).map(function (m) { return '<a href="#/dolce/' + m.id + '">' + th(m) + '<b>' + m.n + '</b><span>' + prezzoDa(m) + '</span></a>'; }).join(''); }
  function menu(c) {
    if (c) cat = c;
    $('#tabs').innerHTML = CAT.map(function (x) { return '<button type="button" data-cat="' + x[0] + '" aria-pressed="' + (x[0] === cat) + '">' + x[1] + '</button>'; }).join('');
    $('#lista').innerHTML = MENU.filter(function (m) { return m.c === cat; }).map(function (m) { return '<li><a href="#/dolce/' + m.id + '">' + th(m) + '<span><b>' + m.n + '</b><small>' + m.d + '</small></span><span class="pr">' + prezzoDa(m) + '</span></a></li>'; }).join('');
  }
  var dataMin = function () { var d = new Date(); d.setDate(d.getDate() + 2); return d.toISOString().slice(0, 10); };
  function dolce(id) {
    var m = byId(id) || MENU[0], f = $('#d-form'), h = '';
    $('#d-head').innerHTML = th(m, 'd-img') + '<h1 id="d-nome">' + m.n + '</h1><p class="d-desc">' + m.d + '</p>';
    if (m.torta) {
      h += '<fieldset><legend>Grandezza</legend><div class="pz">' + MISURE.map(function (x, i) { return '<label><input type="radio" name="mis" value="' + x[0] + '"' + (i === 1 ? ' checked' : '') + '><b>' + x[1] + '</b><small>' + euro(x[2]) + '</small></label>'; }).join('') + '</div></fieldset>';
      if (!m.gusto) h += '<fieldset><legend>Farcitura</legend><div class="gusti">' + GUSTI.map(function (g, i) { return '<label><input type="radio" name="gusto" value="' + g[0] + '"' + (i ? '' : ' checked') + '>' + g[0] + '<small>' + (g[1] ? '+' + euro(g[1]) : 'compresa') + '</small></label>'; }).join('') + '</div></fieldset>';
      h += '<label class="lab" for="scritta">Scritta sulla torta <small>(facoltativa)</small></label><input class="in" id="scritta" maxlength="28" placeholder="Es. Auguri Nonna Rosa" autocomplete="off"><p class="cont" id="cont">0/28</p><div class="anteprima" id="anteprima" aria-hidden="true">la tua scritta</div>';
      h += '<label class="lab" for="giorno">Giorno di ritiro <small>(almeno 48 ore prima)</small></label><input class="in" type="date" id="giorno" min="' + dataMin() + '" value="' + dataMin() + '"><p class="err" id="e-giorno" role="alert"></p>';
      f.dataset.q = 1;
      h += '<div class="addbar"><button class="btn full" type="submit" id="d-add"></button></div>';
    } else {
      f.dataset.q = m.unita ? 12 : 1;
      h += '<div class="addbar"><div class="qty"><button type="button" data-q="-1" aria-label="Uno in meno">−</button><output id="d-q"></output><button type="button" data-q="1" aria-label="Uno in più">+</button></div><button class="btn" type="submit" id="d-add"></button></div>';
    }
    f.innerHTML = h; f.dataset.id = m.id; aggiorna();
  }
  function scelta() {
    var f = $('#d-form'), m = byId(f.dataset.id);
    if (!m.torta) return { m: m, unit: m.p, nota: m.unita ? 'pezzi misti' : '' };
    var mis = MISURE.filter(function (x) { return x[0] === ($('input[name=mis]:checked', f) || {}).value; })[0] || MISURE[1];
    var g = $('input[name=gusto]:checked', f), gp = g ? GUSTI.filter(function (x) { return x[0] === g.value; })[0][1] : 0;
    var scr = ($('#scritta').value || '').trim(), gi = $('#giorno').value;
    return { m: m, unit: mis[2] + gp, nota: mis[1] + ', ' + (g ? g.value.toLowerCase() : m.gusto.toLowerCase()) + (scr ? ', scritta «' + scr + '»' : '') + (gi ? ', ritiro il ' + new Date(gi + 'T12:00').toLocaleDateString('it-IT', { day: 'numeric', month: 'long' }) : ''), giorno: gi };
  }
  function aggiorna() {
    var f = $('#d-form'), s = scelta(), q = +f.dataset.q;
    if ($('#d-q')) $('#d-q').textContent = q;
    $('#d-add').textContent = 'Aggiungi · ' + euro(s.unit * q);
    var sc = $('#scritta'); if (sc) { $('#cont').textContent = sc.value.length + '/28'; $('#anteprima').textContent = sc.value.trim() || 'la tua scritta'; }
  }
  function slotOrari() { var out = [], d = new Date(); d.setMinutes(d.getMinutes() + 20); var m = Math.ceil(d.getMinutes() / 15) * 15; d.setMinutes(m, 0, 0); for (var i = 0; i < 8; i++) { var h = d.getHours(); if (h >= 6 && h < 20) out.push(h + ':' + ('0' + d.getMinutes()).slice(-2)); d.setMinutes(d.getMinutes() + 15); } if (!out.length) out = ['7:00', '7:15', '7:30', '7:45', '8:00', '8:15']; return out; }
  function carrello() {
    var b = $('#cart');
    if (!cart.length) { b.innerHTML = '<p class="empty">Il vassoio è vuoto.</p><a class="btn full" href="#/menu">Guarda il banco</a>'; return; }
    var sub = cart.reduce(function (a, r) { return a + r.unit * r.q; }, 0), orari = slotOrari(), solotorte = cart.every(function (r) { return r.torta; });
    if (!st.slot || orari.indexOf(st.slot) < 0) st.slot = orari[0];
    b.innerHTML = '<ul class="cart-l">' + cart.map(function (r, i) { return '<li><b>' + esc(r.n) + '</b><div class="qty"><button type="button" data-cq="-1" data-i="' + i + '" aria-label="Togli uno: ' + esc(r.n) + '">−</button><output>' + r.q + '</output><button type="button" data-cq="1" data-i="' + i + '" aria-label="Aggiungi uno: ' + esc(r.n) + '">+</button></div><small>' + (r.nota ? esc(r.nota) + ' · ' : '') + euro(r.unit * r.q) + '</small></li>'; }).join('') + '</ul>' +
      (solotorte ? '<p class="nota">La torta la ritiri nel giorno che hai scelto.</p>' : '<div class="seg" role="group" aria-label="Come lo vuoi"><button type="button" data-modo="asporto" aria-pressed="' + (st.modo === 'asporto') + '">Da portare via</button><button type="button" data-modo="tavolo" aria-pressed="' + (st.modo === 'tavolo') + '">Al tavolo</button></div><p class="lab" style="margin-top:6px">' + (st.modo === 'tavolo' ? 'Arrivo alle' : 'Ritiro alle') + '</p><div class="slot" role="group" aria-label="Orario">' + orari.map(function (o) { return '<button type="button" data-slot="' + o + '" aria-pressed="' + (st.slot === o) + '">' + o + '</button>'; }).join('') + '</div>') +
      '<div class="tot"><p class="g"><span>Da pagare in cassa</span><span>' + euro(sub) + '</span></p></div><button class="btn full" type="button" id="ordina">Invia l\'ordine (demo)</button><p class="nota">Demo: l\'ordine non arriva a nessuno e non si paga online.</p>';
  }
  function ordini() {
    var o = st.ordini[0], b = $('#ord');
    b.innerHTML = (o ? '<div class="ticket"><small>Il tuo numero</small><div class="num">' + o.n + '</div><div class="quando">' + o.quando + '</div><div class="stato"><span class="on">Ricevuto</span><span>In preparazione</span><span>Pronto</span></div><p class="righe">' + esc(o.righe) + ' · ' + euro(o.tot) + '</p></div><p class="nota">Mostra il numero alla cassa. Ti avvisiamo quando è pronto.</p>' : '<p class="empty">Nessun ordine da ritirare.</p><a class="btn full" href="#/menu">Ordina qualcosa</a>') +
      '<h2 class="sec">Ordini di prima</h2><ul class="vecchi">' + st.ordini.slice(1, 4).concat([{ n: 37, righe: '2× Cornetto al pistacchio, 2× Cappuccino', tot: 6.8, quando: 'sabato, ritiro alle 8:30' }]).map(function (x) { return '<li><b>N. ' + x.n + ' · ' + euro(x.tot) + '</b><small>' + esc(x.righe) + ' · ' + x.quando + '</small></li>'; }).join('') + '</ul>';
  }
  var R = { home: home, menu: menu, dolce: dolce, carrello: carrello, ordini: ordini };
  function route() {
    var p = location.hash.replace(/^#\/?/, '').split('/'), n = R[p[0]] ? p[0] : 'home';
    $$('[data-screen]').forEach(function (s) { s.hidden = s.dataset.screen !== n; });
    var tab = n === 'dolce' ? 'menu' : n;
    $$('.tabbar a').forEach(function (a) { if (a.dataset.tab === tab) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    R[n](p[1]); window.scrollTo(0, 0); var sc = document.querySelector('.app > main'); if (sc) sc.scrollTop = 0;
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.dataset.cat) { cat = b.dataset.cat; menu(); }
    else if (b.dataset.q) { var f = $('#d-form'), mm = byId(f.dataset.id); f.dataset.q = Math.max(1, Math.min(mm.unita ? 60 : 12, +f.dataset.q + +b.dataset.q)); aggiorna(); }
    else if (b.dataset.cq) { var r = cart[+b.dataset.i]; r.q += +b.dataset.cq; if (r.q < 1) cart.splice(+b.dataset.i, 1); salva(); carrello(); }
    else if (b.dataset.modo) { st.modo = b.dataset.modo; salva(); carrello(); }
    else if (b.dataset.slot) { st.slot = b.dataset.slot; salva(); carrello(); }
    else if (b.id === 'ordina') {
      var tot = cart.reduce(function (a, r) { return a + r.unit * r.q; }, 0), solo = cart.every(function (x) { return x.torta; });
      st.ordini.unshift({ n: 40 + st.ordini.length + 2, tot: tot, righe: cart.map(function (x) { return x.q + '× ' + x.n; }).join(', '), quando: solo ? 'Torta: ritiro nel giorno scelto' : (st.modo === 'tavolo' ? 'Al tavolo, arrivo alle ' : 'Ritiro alle ') + st.slot });
      cart = []; salva(); location.hash = '#/ordini';
    }
  });
  document.addEventListener('input', function (e) { if (e.target.closest('#d-form')) aggiorna(); });
  document.addEventListener('change', function (e) { if (e.target.closest('#d-form')) aggiorna(); });
  document.addEventListener('submit', function (e) {
    e.preventDefault();
    if (e.target.id !== 'd-form') return;
    var s = scelta(), q = +e.target.dataset.q;
    if (s.m.torta && (!s.giorno || s.giorno < dataMin())) { $('#e-giorno').textContent = 'Per le torte servono almeno 48 ore: scegli dal ' + new Date(dataMin() + 'T12:00').toLocaleDateString('it-IT', { day: 'numeric', month: 'long' }) + ' in poi.'; $('#giorno').focus(); return; }
    var ex = cart.filter(function (r) { return r.id === s.m.id && r.nota === s.nota; })[0];
    if (ex) ex.q += q; else cart.push({ id: s.m.id, n: s.m.n, unit: s.unit, nota: s.nota, q: q, torta: !!s.m.torta });
    salva(); toast(s.m.n + ' nel vassoio'); location.hash = '#/menu';
  });
  window.addEventListener('hashchange', route);
  aperto(); salva(); route();
})();
