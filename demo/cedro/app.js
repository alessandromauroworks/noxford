/* Cedro - app dimostrativa. Nessun dato viene inviato: tavolo e asporto restano in questo browser. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var mem = {
    get: function (k, d) { try { var v = localStorage.getItem('cedro-' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('cedro-' + k, JSON.stringify(v)); } catch (e) {} }
  };
  var CAT = [['mezze', 'Mezze'], ['griglia', 'Griglia'], ['caldi', 'Piatti caldi'], ['dolci', 'Dolci']];
  var P = [
    { id: 'mezze', c: 'mezze', n: 'Mezze per due', d: 'Hummus, baba ghanoush, tabbouleh, falafel, sottaceti e pane caldo.', p: 24, pic: 1, adj: 1, veg: 1, img: 'img/mezze.webp', alt: 'Tavola di mezze libanesi vista dall\'alto: hummus, baba ghanoush, falafel, sottaceti e pane pita', all: 'sesamo, glutine' },
    { id: 'hummus', c: 'mezze', n: 'Hummus', d: 'Ceci, tahina, limone e olio. Paprika a parte.', p: 7, pic: 0, adj: 1, veg: 1, all: 'sesamo' },
    { id: 'muhammara', c: 'mezze', n: 'Muhammara', d: 'Crema di peperoni arrostiti, noci e melassa di melograno.', p: 8, pic: 2, adj: 1, veg: 1, all: 'frutta a guscio, glutine' },
    { id: 'falafel', c: 'mezze', n: 'Falafel', d: 'Sei polpette di ceci e fave con salsa tahina.', p: 8, pic: 0, veg: 1, all: 'sesamo' },
    { id: 'grill', c: 'griglia', n: 'Griglia mista', d: 'Spiedini di pollo taouk e kafta di manzo, cipolla al sumac, toum all\'aglio.', p: 19, pic: 1, adj: 1, img: 'img/grill.webp', alt: 'Piatto con spiedini di pollo e kafta alla griglia, salsa all\'aglio, pomodori e cipolle grigliate e pane', all: 'glutine' },
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
  var RIT = ['12:30', '12:45', '13:00', '19:15', '19:30', '19:45', '20:00', '20:15'];
  var st = mem.get('stato', { borsa: [], tav: null, ord: null });
  var f = { cat: 'mezze', pic: 3, veg: false };
  var sel = { pic: 1, porz: 'n', q: 1 };
  var tav = { g: 0, pers: 2, ora: null, zona: 'sala', md: 1 };
  var rit = { ora: null };
  var GG = ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'];
  var MM = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];
  var byId = function (id) { return P.filter(function (x) { return x.id === id; })[0]; };
  var eur = function (n) { return n.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'; };
  var giorno = function (k) { var d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + k); return d; };
  var salva = function () { mem.set('stato', st); $('#n-borsa').textContent = st.borsa.reduce(function (s, r) { return s + r.q; }, 0); };
  var PEP = function (on) { return '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 5c2-1 5 0 6 2 1 3-2 7-7 8 2-3 0-6 1-10z" fill="' + (on ? '#A8323E' : '#D9CDB6') + '"/><path d="M8 5c0-2 1-3 3-3" fill="none" stroke="#2C5340" stroke-width="1.4"/></svg>'; };
  var pep = function (n, max) { var s = '<span class="peperoncini" role="img" aria-label="' + LIV[n] + '">'; for (var i = 0; i < (max || 3); i++) s += PEP(i < n); return s + '</span>'; };
  var piatto = function (x) { return '<svg class="p-ill" viewBox="0 0 320 240" role="img" aria-label="Disegno del piatto ' + x.n + '"><rect width="320" height="240" fill="#2C5340"/><circle cx="160" cy="124" r="88" fill="#F6EFE3"/><circle cx="160" cy="124" r="62" fill="' + (x.c === 'dolci' ? '#E9C98B' : x.pic > 1 ? '#C4573F' : '#D9B77A') + '"/><circle cx="140" cy="108" r="8" fill="#7C9A5E"/><circle cx="178" cy="132" r="6" fill="#7C9A5E"/><circle cx="160" cy="146" r="5" fill="#A8323E"/></svg>'; };
  function aperto() { var n = new Date(), m = n.getHours() * 60 + n.getMinutes(), lun = n.getDay() === 1; if (lun) return ['Oggi chiuso, riapriamo domani alle 12', 1]; if (m >= 720 && m < 900) return ['Aperto ora, cucina fino alle 14:45', 0]; if (m >= 1140 && m < 1410) return ['Aperto ora, cucina fino alle 23:30', 0]; return [m < 720 ? 'Apriamo alle 12:00' : m < 1140 ? 'Stasera apriamo alle 19:00' : 'Chiuso, domani dalle 12', 1]; }
  function home() {
    var a = aperto(), e = $('#h-aperto'); e.textContent = a[0]; e.className = 'aperto' + (a[1] ? ' chiuso' : '');
    var m = byId('mezze');
    $('#h-oggi').innerHTML = '<img src="' + m.img + '" alt="" width="240" height="192" loading="lazy"><span><b>' + m.n + '</b><small>' + m.d + '</small><br><small><b style="font-family:var(--testo);font-size:15px;display:inline">' + eur(m.p) + '</b> · ' + LIV[m.pic].toLowerCase() + '</small></span>';
    $('#h-leg').innerHTML = LIV.map(function (l, i) { return '<li>' + pep(i) + '<b>' + l + '</b>' + LIVD[i] + '</li>'; }).join('');
  }
  function menu() {
    $('#me-cat').innerHTML = CAT.map(function (c) { return '<button type="button" data-cat="' + c[0] + '" aria-pressed="' + (c[0] === f.cat) + '">' + c[1] + '</button>'; }).join('');
    $('#me-pic').innerHTML = [0, 1, 2, 3].map(function (i) { return '<button type="button" data-fpic="' + i + '" aria-pressed="' + (i === f.pic) + '" aria-label="Piccante al massimo: ' + LIV[i].toLowerCase() + '">' + (i === 3 ? 'Tutti' : pep(i, Math.max(1, i))) + '</button>'; }).join('');
    $('#me-veg').checked = f.veg;
    var l = P.filter(function (x) { return x.c === f.cat && x.pic <= f.pic && (!f.veg || x.veg); });
    $('#me-lista').innerHTML = l.length ? l.map(function (x) { return '<li><a href="#/piatto/' + x.id + '"><b>' + x.n + (x.veg ? '<span class="tag">veg</span>' : '') + '</b><span class="pr">' + eur(x.p) + '</span><small>' + pep(x.pic) + ' ' + x.d + '</small></a></li>'; }).join('') : '<li class="vuoto">Nessun piatto con questi filtri.</li>';
  }
  function piattoScr(id) {
    var x = byId(id) || P[0]; sel = { id: x.id, pic: x.pic, porz: 'n', q: 1 };
    disegnaPiatto();
  }
  function disegnaPiatto() {
    var x = byId(sel.id), prezzo = (x.p + (sel.porz === 'g' ? Math.round(x.p * 0.6) : 0)) * sel.q;
    $('#p-box').innerHTML = (x.img ? '<img class="p-img" src="' + x.img + '" alt="' + x.alt + '" width="800" height="600">' : piatto(x)) + '<h1 id="p-nome">' + x.n + '</h1><p class="p-desc">' + x.d + '</p>' +
      '<p class="f-lab">Quanto piccante' + (x.adj ? '' : ' · questo piatto si fa solo così') + '</p><div class="scala" role="group" aria-label="Livello di piccante">' + LIV.map(function (l, i) { return '<button type="button" data-pic="' + i + '" aria-pressed="' + (i === sel.pic) + '"' + (!x.adj && i !== x.pic ? ' disabled' : '') + '>' + pep(i) + l + '</button>'; }).join('') + '</div>' +
      '<p class="f-lab">Porzione</p><div class="seg" role="group" aria-label="Porzione"><button type="button" data-porz="n" aria-pressed="' + (sel.porz === 'n') + '">Normale<small>' + eur(x.p) + '</small></button><button type="button" data-porz="g" aria-pressed="' + (sel.porz === 'g') + '">Da dividere<small>+' + eur(Math.round(x.p * 0.6)) + '</small></button></div>' +
      '<p class="allerg"><b>Allergeni:</b> ' + x.all + '. Per allergie gravi chiamaci prima di ordinare.</p>' +
      '<div class="addbar"><div class="qt"><button type="button" data-q="-1" aria-label="Uno in meno">−</button><b>' + sel.q + '</b><button type="button" data-q="1" aria-label="Uno in più">+</button></div><button class="btn" type="button" id="p-add">Aggiungi all\'asporto · ' + eur(prezzo) + '</button></div>';
  }
  function prenota() {
    if (tav.md === 2 && st.tav) { var t = st.tav; $('#pr-box').innerHTML = '<div class="ok"><h2>Tavolo prenotato</h2><span class="num">' + t.pers + '</span><p>persone · ' + t.g + ' alle ' + t.ora + '</p><p>' + (t.zona === 'sala' ? 'In sala' : 'Nel dehors riscaldato') + (t.note ? ' · nota: ' + t.note : '') + '</p><p>Se tardi più di 15 minuti scrivici: teniamo il tavolo.</p><button class="btn chiaro" type="button" id="pr-annulla">Annulla la prenotazione</button></div>'; return; }
    var g = '';
    for (var k = 0; k < 10; k++) { var d = giorno(k), ch = d.getDay() === 1; g += '<button type="button" data-tg="' + k + '" aria-pressed="' + (k === tav.g) + '"' + (ch ? ' disabled aria-label="lunedì, chiuso"' : '') + '><small>' + (k === 0 ? 'oggi' : GG[d.getDay()]) + '</small><b>' + d.getDate() + '</b></button>'; }
    if (giorno(tav.g).getDay() === 1) tav.g++;
    var dd = giorno(tav.g);
    $('#pr-box').innerHTML = '<p class="f-lab">Giorno</p><div class="giorni" role="group" aria-label="Giorno">' + g + '</div>' +
      '<p class="f-lab">Persone</p><div class="step"><button type="button" data-tp="-1" aria-label="Una persona in meno">−</button><b>' + tav.pers + (tav.pers === 1 ? ' persona' : ' persone') + '</b><button type="button" data-tp="1" aria-label="Una persona in più">+</button></div>' + (tav.pers > 8 ? '<p class="nota">Oltre 8 persone vi mettiamo nella sala piccola, tutta per voi.</p>' : '') +
      '<p class="f-lab">Orario, cena</p><div class="orari" role="group" aria-label="Orario">' + ORE.map(function (o, i) { var pieno = ((dd.getDate() + i * 3 + tav.pers) % 5 === 0) || (dd.getDay() === 6 && i === 2); if (pieno && tav.ora === o) tav.ora = null; return '<button type="button" data-to="' + o + '" aria-pressed="' + (tav.ora === o) + '"' + (pieno ? ' disabled aria-label="' + o + ', pieno"' : '') + '>' + o + '</button>'; }).join('') + '</div>' +
      '<p class="f-lab">Dove</p><div class="seg" role="group" aria-label="Zona"><button type="button" data-tz="sala" aria-pressed="' + (tav.zona === 'sala') + '">In sala<small>vicino alla griglia</small></button><button type="button" data-tz="dehors" aria-pressed="' + (tav.zona === 'dehors') + '">Dehors<small>coperto e riscaldato</small></button></div>' +
      '<label class="f" for="pr-note">Allergie o occasioni<textarea id="pr-note" rows="2" placeholder="Es. un celiaco, un compleanno"></textarea></label><p class="err" id="pr-err" role="alert"></p>' +
      '<button class="btn full" type="button" id="pr-ok">Prenota (demo)</button><p class="nota">Demo: non inviamo nulla. Nella versione vera ti arriva un messaggio di conferma.</p>';
  }
  function asporto() {
    var box = $('#as-box');
    if (st.ord) { box.innerHTML = '<div class="ok"><h2>Ordine ricevuto</h2><span class="num">' + st.ord.num + '</span><p>Il tuo numero di ritiro. Passa alle <b>' + st.ord.ora + '</b>.</p><p>Totale ' + st.ord.tot + ', si paga al ritiro.</p><button class="btn chiaro" type="button" id="as-nuovo">Nuovo ordine</button></div>'; return; }
    if (!st.borsa.length) { box.innerHTML = '<p class="vuoto">L\'ordine è vuoto. Scegli qualcosa dal menu.</p><a class="btn full" href="#/menu">Vai al menu</a>'; return; }
    var tot = st.borsa.reduce(function (s, r) { return s + r.p * r.q; }, 0), cont = st.borsa.length > 3 ? 0 : 0.5 * st.borsa.length;
    box.innerHTML = st.borsa.map(function (r, i) { return '<div class="riga-c"><span><b>' + r.n + '</b><small>' + LIV[r.pic].toLowerCase() + (r.porz === 'g' ? ' · da dividere' : '') + ' · ' + eur(r.p) + '</small></span><div class="qt"><button type="button" data-bq="' + i + '" data-d="-1" aria-label="Uno in meno">−</button><b>' + r.q + '</b><button type="button" data-bq="' + i + '" data-d="1" aria-label="Uno in più">+</button></div></div>'; }).join('') +
      '<p class="f-lab">Orario di ritiro</p><div class="orari" role="group" aria-label="Orario di ritiro">' + RIT.map(function (o) { var n = new Date(), hm = o.split(':'), passato = +hm[0] * 60 + +hm[1] < n.getHours() * 60 + n.getMinutes() + 20; if (passato && rit.ora === o) rit.ora = null; return '<button type="button" data-ro="' + o + '" aria-pressed="' + (rit.ora === o) + '"' + (passato ? ' disabled aria-label="' + o + ', troppo presto"' : '') + '>' + o + '</button>'; }).join('') + '</div>' +
      '<label class="f" for="as-nome">Nome per il ritiro<input id="as-nome" autocomplete="off" placeholder="Come ti chiami"></label>' +
      '<div class="totali"><p><span>Piatti</span><span>' + eur(tot) + '</span></p><p><span>Contenitori compostabili</span><span>' + (cont ? eur(cont) : 'gratis sopra 3 piatti') + '</span></p><p class="t"><span>Totale</span><span>' + eur(tot + cont) + '</span></p></div><p class="err" id="as-err" role="alert"></p>' +
      '<button class="btn full" type="button" id="as-ok">Ordina e ritira (demo)</button><p class="nota">Demo: nessun ordine parte davvero.</p>';
  }
  var R = { home: home, menu: menu, piatto: piattoScr, prenota: prenota, asporto: asporto };
  function route() {
    var p = location.hash.replace(/^#\/?/, '').split('/'), n = R[p[0]] ? p[0] : 'home';
    $$('[data-screen]').forEach(function (s) { s.hidden = s.dataset.screen !== n; });
    var tab = n === 'piatto' ? 'menu' : n;
    $$('.tabbar a').forEach(function (a) { if (a.dataset.tab === tab) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    R[n](p[1]); window.scrollTo(0, 0); var sc = $('.app > main'); if (sc) sc.scrollTop = 0;
  }
  var tieni = function (fn) { var sc = $('.app > main'), y = sc ? sc.scrollTop : 0, wy = window.scrollY; fn(); if (sc) sc.scrollTop = y; window.scrollTo(0, wy); };
  document.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b || b.disabled) return;
    if (b.dataset.cat) { f.cat = b.dataset.cat; menu(); }
    else if (b.dataset.fpic) { f.pic = +b.dataset.fpic; menu(); }
    else if (b.dataset.pic) { sel.pic = +b.dataset.pic; tieni(disegnaPiatto); }
    else if (b.dataset.porz) { sel.porz = b.dataset.porz; tieni(disegnaPiatto); }
    else if (b.dataset.q) { sel.q = Math.max(1, Math.min(9, sel.q + +b.dataset.q)); tieni(disegnaPiatto); }
    else if (b.id === 'p-add') { var x = byId(sel.id), pz = x.p + (sel.porz === 'g' ? Math.round(x.p * 0.6) : 0), ex = st.borsa.filter(function (r) { return r.id === x.id && r.pic === sel.pic && r.porz === sel.porz; })[0]; if (ex) ex.q += sel.q; else st.borsa.push({ id: x.id, n: x.n, pic: sel.pic, porz: sel.porz, p: pz, q: sel.q }); st.ord = null; salva(); location.hash = '#/menu'; }
    else if (b.dataset.tg) { tav.g = +b.dataset.tg; tav.ora = null; tieni(prenota); }
    else if (b.dataset.tp) { tav.pers = Math.max(1, Math.min(14, tav.pers + +b.dataset.tp)); tieni(prenota); }
    else if (b.dataset.to) { tav.ora = b.dataset.to; tieni(prenota); }
    else if (b.dataset.tz) { tav.zona = b.dataset.tz; tieni(prenota); }
    else if (b.id === 'pr-ok') { if (!tav.ora) { $('#pr-err').textContent = 'Scegli un orario libero.'; return; } var d = giorno(tav.g); st.tav = { g: GG[d.getDay()] + ' ' + d.getDate() + ' ' + MM[d.getMonth()], pers: tav.pers, ora: tav.ora, zona: tav.zona, note: $('#pr-note').value.trim() }; salva(); tav.md = 2; prenota(); }
    else if (b.id === 'pr-annulla') { st.tav = null; tav.md = 1; salva(); prenota(); }
    else if (b.dataset.bq) { var r = st.borsa[+b.dataset.bq]; r.q += +b.dataset.d; if (r.q < 1) st.borsa.splice(+b.dataset.bq, 1); salva(); tieni(asporto); }
    else if (b.dataset.ro) { rit.ora = b.dataset.ro; var nm = $('#as-nome').value; tieni(asporto); $('#as-nome').value = nm; }
    else if (b.id === 'as-ok') { var nome = $('#as-nome').value.trim(); if (!rit.ora) { $('#as-err').textContent = 'Scegli l\'orario di ritiro.'; return; } if (nome.length < 2) { $('#as-err').textContent = 'Scrivi il nome per il ritiro.'; return; } var tot = st.borsa.reduce(function (s, x2) { return s + x2.p * x2.q; }, 0) + (st.borsa.length > 3 ? 0 : 0.5 * st.borsa.length); st.ord = { num: 40 + (new Date().getMinutes() % 50), ora: rit.ora, tot: eur(tot) }; st.borsa = []; salva(); asporto(); }
    else if (b.id === 'as-nuovo') { st.ord = null; salva(); asporto(); }
  });
  document.addEventListener('change', function (e) { if (e.target.id === 'me-veg') { f.veg = e.target.checked; menu(); } });
  window.addEventListener('hashchange', route);
  salva(); route();
})();
