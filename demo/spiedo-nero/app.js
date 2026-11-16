/* Spiedo Nero - app dimostrativa. Nessun dato viene inviato: carrello e ordini restano nel browser. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var euro = function (n) { return n.toFixed(2).replace('.', ',') + ' €'; };
  var esc = function (t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var mem = {
    get: function (k, d) { try { var v = localStorage.getItem('spiedonero-' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('spiedonero-' + k, JSON.stringify(v)); } catch (e) {} }
  };

  var ICO = {
    kebab: '<svg viewBox="0 0 24 24"><path d="M12 2v20" stroke="currentColor" stroke-width="1.8"/><path d="M7 6h10l-1.6 3.4H8.6zM6 11h12l-1.8 4.2H7.8z" fill="currentColor"/></svg>',
    box: '<svg viewBox="0 0 24 24"><path d="M3 8h18l-2 12H5zM3 8l3-4h12l3 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    veg: '<svg viewBox="0 0 24 24"><path d="M5 19C5 10 11 5 20 4c-1 9-6 15-15 15zM5 19l8-8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    contorni: '<svg viewBox="0 0 24 24"><path d="M6 10h12l-1.5 10h-9zM8 10 7 3M11 10V3M14 10l1-7M17 10l2-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    bevande: '<svg viewBox="0 0 24 24"><path d="M7 4h10l-1.5 17h-7zM7.5 9h9" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    dolci: '<svg viewBox="0 0 24 24"><path d="M4 14h16l-2 6H6zM6 14c0-4 3-7 6-7s6 3 6 7M12 7V4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'
  };
  var CATS = [['kebab', 'Kebab'], ['box', 'Box e piatti'], ['veg', 'Vegetariano'], ['contorni', 'Contorni'], ['bevande', 'Bevande'], ['dolci', 'Dolci']];
  var MENU = [
    { id: 'classico', c: 'kebab', n: 'Kebab classico', d: 'Piadina calda, carne dallo spiedo, insalata, pomodoro, cipolla e salsa a scelta.', p: 6.5, opt: true, img: 'img/spiedo.webp', pop: 1 },
    { id: 'durum', c: 'kebab', n: 'Dürüm', d: 'Arrotolato nella piadina sottile e ripassato sulla piastra.', p: 7.5, opt: true, img: 'img/wrap.webp', pop: 1 },
    { id: 'pollo', c: 'kebab', n: 'Kebab di pollo', d: 'Pollo marinato al limone e paprica dolce.', p: 6.5, opt: true },
    { id: 'piccante', c: 'kebab', n: 'Kebab del diavolo', d: 'Carne mista, jalapeños, cipolla rossa e salsa piccante della casa.', p: 7.5, opt: true, hot: 1 },
    { id: 'box', c: 'box', n: 'Box kebab', d: 'Carne, patatine speziate, insalata, cavolo rosso e due salse.', p: 9.5, opt: true, img: 'img/box.webp', pop: 1 },
    { id: 'piatto', c: 'box', n: 'Piatto misto', d: 'Carne, riso al burro, hummus, insalata e pane caldo.', p: 11 },
    { id: 'falafel', c: 'veg', n: 'Wrap falafel', d: 'Falafel di ceci, hummus, verdure e tahina.', p: 6, opt: true, veg: 1, pop: 1 },
    { id: 'hummus', c: 'veg', n: 'Hummus e pane', d: 'Crema di ceci con olio, paprica e pane caldo.', p: 4.5, veg: 1 },
    { id: 'patatine', c: 'contorni', n: 'Patatine', d: 'Fritte al momento.', p: 3 },
    { id: 'patspez', c: 'contorni', n: 'Patatine speziate', d: 'Con paprica affumicata e origano.', p: 3.5, pop: 1 },
    { id: 'insalata', c: 'contorni', n: 'Insalata di stagione', d: 'Lattuga, pomodoro, cetriolo e limone.', p: 4, veg: 1 },
    { id: 'ayran', c: 'bevande', n: 'Ayran', d: 'Bevanda allo yogurt, fresca e salata.', p: 2 },
    { id: 'bibita', c: 'bevande', n: 'Bibita in lattina', d: 'Cola, aranciata o limonata.', p: 2.5 },
    { id: 'acqua', c: 'bevande', n: 'Acqua 50 cl', d: 'Naturale o frizzante.', p: 1 },
    { id: 'baklava', c: 'dolci', n: 'Baklava', d: 'Tre pezzi di sfoglia con pistacchi e miele.', p: 3.5 }
  ];
  var OPZ = {
    carne: [['Vitello', 0], ['Pollo', 0], ['Misto', 0]],
    taglia: [['Normale', 0], ['Maxi', 2]],
    togli: ['Insalata', 'Pomodoro', 'Cipolla', 'Cavolo rosso'],
    salse: ['Yogurt e aglio', 'Piccante', 'Tahina', 'Barbecue'],
    extra: [['Formaggio fuso', 1], ['Doppia carne', 2.5], ['Jalapeños', .8], ['Patatine dentro', 1]]
  };
  var CODICI = { NERO10: 0.10 };
  var byId = function (id) { return MENU.filter(function (m) { return m.id === id; })[0]; };
  var thumb = function (m, cls) {
    return m.img ? '<img class="th ' + (cls || '') + '" src="' + m.img + '" alt="" loading="lazy" width="300" height="300">'
      : '<span class="th ' + (cls || '') + '" aria-hidden="true">' + ICO[m.c] + '</span>';
  };

  var cart = mem.get('carrello', []);
  var stato = mem.get('stato', { modo: 'consegna', codice: '', punti: 6, ordini: [], attivo: null });
  var menuCat = 'kebab';

  function toast(t) { var el = $('#toast'); el.textContent = t; el.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(function () { el.classList.remove('on'); }, 2400); }
  function salva() { mem.set('carrello', cart); mem.set('stato', stato); badge(); }
  function badge() { var n = cart.reduce(function (a, r) { return a + r.q; }, 0); var b = $('#badge'); b.hidden = !n; b.textContent = n; }

  /* ---------- HOME ---------- */
  function home() {
    $('#home-cats').innerHTML = CATS.map(function (c) { return '<a class="cat" href="#/menu/' + c[0] + '">' + ICO[c[0]] + c[1] + '</a>'; }).join('');
    $('#home-pop').innerHTML = MENU.filter(function (m) { return m.pop; }).map(function (m) {
      return '<a class="pop" href="#/prodotto/' + m.id + '">' + thumb(m) + '<div class="tx"><b>' + esc(m.n) + '</b><span>' + euro(m.p) + '</span></div></a>';
    }).join('');
  }

  /* ---------- MENU ---------- */
  function menu(cat) {
    if (cat) menuCat = cat;
    $('#menu-tabs').innerHTML = CATS.map(function (c) { return '<button type="button" data-cat="' + c[0] + '" aria-pressed="' + (c[0] === menuCat) + '">' + c[1] + '</button>'; }).join('');
    lista();
  }
  function lista() {
    var q = $('#cerca').value.trim().toLowerCase();
    var voci = MENU.filter(function (m) { return q ? (m.n + ' ' + m.d).toLowerCase().indexOf(q) > -1 : m.c === menuCat; });
    $('#menu-list').innerHTML = voci.map(function (m) {
      return '<li><a class="item" href="#/prodotto/' + m.id + '">' + thumb(m) + '<span><b>' + esc(m.n) + (m.veg ? '<span class="tag-v">VEG</span>' : '') + (m.hot ? '<span class="tag-v tag-p">PICCANTE</span>' : '') + '</b><small>' + esc(m.d) + '</small></span><span class="pr">' + euro(m.p) + '</span></a></li>';
    }).join('');
    $('#menu-vuoto').hidden = voci.length > 0;
  }

  /* ---------- DETTAGLIO ---------- */
  function prodotto(id) {
    var m = byId(id) || MENU[0];
    $('#p-head').innerHTML = '<div class="ph">' + thumb(m) + '</div><h1 id="p-nome">' + esc(m.n) + '</h1><p>' + esc(m.d) + '</p>';
    var f = $('#p-form'), h = '';
    if (m.opt && m.c !== 'veg') {
      h += '<fieldset><legend>Carne</legend>' + OPZ.carne.map(function (o, i) { return '<label class="choice"><input type="radio" name="carne" value="' + o[0] + '"' + (i === (m.id === 'pollo' ? 1 : 0) ? ' checked' : '') + '><span>' + o[0] + '</span></label>'; }).join('') + '</fieldset>';
    }
    if (m.opt) {
      h += '<fieldset><legend>Taglia</legend>' + OPZ.taglia.map(function (o, i) { return '<label class="choice"><input type="radio" name="taglia" value="' + o[0] + '" data-p="' + o[1] + '"' + (i ? '' : ' checked') + '><span>' + o[0] + '</span>' + (o[1] ? '<em>+' + euro(o[1]) + '</em>' : '') + '</label>'; }).join('') + '</fieldset>';
      h += '<fieldset><legend>Togli qualcosa</legend><span class="hint">Tocca per toglierlo dal kebab.</span>' + OPZ.togli.map(function (o) { return '<label class="choice"><input type="checkbox" name="togli" value="' + o + '"><span>Senza ' + o.toLowerCase() + '</span></label>'; }).join('') + '</fieldset>';
      h += '<fieldset><legend>Salse</legend><span class="hint" id="salse-hint">Fino a 2, comprese nel prezzo.</span>' + OPZ.salse.map(function (o, i) { return '<label class="choice"><input type="checkbox" name="salse" value="' + o + '"' + (i ? '' : ' checked') + '><span>' + o + '</span></label>'; }).join('') + '</fieldset>';
      h += '<fieldset><legend>Extra</legend>' + OPZ.extra.map(function (o) { return '<label class="choice"><input type="checkbox" name="extra" value="' + o[0] + '" data-p="' + o[1] + '"><span>' + o[0] + '</span><em>+' + euro(o[1]) + '</em></label>'; }).join('') + '</fieldset>';
    }
    h += '<div class="addbar"><div class="qty"><button type="button" data-q="-1" aria-label="Uno in meno">−</button><output id="p-q">1</output><button type="button" data-q="1" aria-label="Uno in più">+</button></div><button class="btn hot" type="submit" id="p-add">Aggiungi · ' + euro(m.p) + '</button></div>';
    f.innerHTML = h; f.dataset.id = m.id; f.dataset.q = 1;
    aggiornaPrezzo();
  }
  function scelte() {
    var f = $('#p-form'), m = byId(f.dataset.id), extra = 0, nota = [];
    $$('input:checked', f).forEach(function (i) { extra += +(i.dataset.p || 0); });
    var c = $('input[name=carne]:checked', f); if (c) nota.push(c.value);
    var t = $('input[name=taglia]:checked', f); if (t && t.value !== 'Normale') nota.push(t.value);
    $$('input[name=togli]:checked', f).forEach(function (i) { nota.push('senza ' + i.value.toLowerCase()); });
    var s = $$('input[name=salse]:checked', f).map(function (i) { return i.value.toLowerCase(); }); if (s.length) nota.push('salse: ' + s.join(' e '));
    $$('input[name=extra]:checked', f).forEach(function (i) { nota.push('+ ' + i.value.toLowerCase()); });
    return { m: m, unit: m.p + extra, nota: nota.join(', ') };
  }
  function aggiornaPrezzo() {
    var f = $('#p-form'), s = scelte(), q = +f.dataset.q;
    $('#p-add').textContent = 'Aggiungi · ' + euro(s.unit * q);
    $('#p-q').textContent = q;
    var salse = $$('input[name=salse]', f), prese = salse.filter(function (i) { return i.checked; }).length;
    salse.forEach(function (i) { var off = !i.checked && prese >= 2; i.disabled = off; i.parentNode.classList.toggle('off', off); });
  }

  /* ---------- CARRELLO ---------- */
  function conti() {
    var sub = cart.reduce(function (a, r) { return a + r.unit * r.q; }, 0);
    var sconto = stato.codice && CODICI[stato.codice] ? sub * CODICI[stato.codice] : 0;
    var cons = stato.modo === 'consegna' && sub > 0 && sub - sconto < 20 ? 2 : 0;
    return { sub: sub, sconto: sconto, cons: cons, tot: sub - sconto + cons };
  }
  function carrello() {
    var box = $('#cart-box');
    if (!cart.length) { box.innerHTML = '<p class="empty">Il carrello è vuoto. Che ne dici di un dürüm?</p><a class="btn hot full" href="#/menu">Vai al menu</a>'; return; }
    var c = conti();
    box.innerHTML = '<ul class="cart-l">' + cart.map(function (r, i) {
      return '<li><b>' + esc(r.n) + '</b><span class="pr">' + euro(r.unit * r.q) + '</span><small>' + (esc(r.nota) || 'Come da menu') + '</small><div class="qty"><button type="button" data-cq="-1" data-i="' + i + '" aria-label="Togli uno: ' + esc(r.n) + '">−</button><output>' + r.q + '</output><button type="button" data-cq="1" data-i="' + i + '" aria-label="Aggiungi uno: ' + esc(r.n) + '">+</button></div></li>';
    }).join('') + '</ul>' +
      '<div class="seg" role="group" aria-label="Come lo vuoi"><button type="button" data-modo="consegna" aria-pressed="' + (stato.modo === 'consegna') + '">Consegna</button><button type="button" data-modo="ritiro" aria-pressed="' + (stato.modo === 'ritiro') + '">Ritiro al locale</button></div>' +
      '<p class="nota" style="margin-top:4px">' + (stato.modo === 'consegna' ? 'Consegna gratis sopra i 20 €, altrimenti 2 €.' : 'Pronto in 15 minuti al banco.') + '</p>' +
      '<form class="codice" id="f-codice" novalidate><label class="sr" for="codice">Codice sconto</label><input id="codice" placeholder="Codice sconto" value="' + esc(stato.codice) + '" autocomplete="off"><button class="btn ghost" type="submit">Applica</button></form>' +
      '<p class="msg' + (c.sconto ? ' ok' : '') + '" id="codice-msg">' + (c.sconto ? 'Codice applicato: −10%.' : 'Codice di prova: NERO10') + '</p>' +
      '<div class="tot"><p><span>Prodotti</span><span>' + euro(c.sub) + '</span></p>' + (c.sconto ? '<p><span>Sconto</span><span>−' + euro(c.sconto) + '</span></p>' : '') + (stato.modo === 'consegna' ? '<p><span>Consegna</span><span>' + (c.cons ? euro(c.cons) : 'Gratis') + '</span></p>' : '') + '<p class="g"><span>Totale</span><span>' + euro(c.tot) + '</span></p></div>' +
      '<button class="btn hot full" type="button" id="invia">Invia l\'ordine (demo)</button><p class="nota">È una demo: l\'ordine non parte davvero e non si paga niente.</p>';
  }
  function invia() {
    var c = conti(), timbri = Math.max(1, Math.floor(c.tot / 10));
    var ord = { n: 1000 + stato.ordini.length + 47, quando: Date.now(), tot: c.tot, righe: cart.map(function (r) { return r.q + '× ' + r.n; }).join(', '), modo: stato.modo, timbri: timbri };
    stato.ordini.unshift(ord); stato.attivo = ord; stato.punti = Math.min(10, stato.punti + timbri);
    cart = []; stato.codice = ''; salva();
    location.hash = '#/ordine';
  }

  /* ---------- ORDINE (tracking) ---------- */
  var timer = null;
  var FASI = [['Ordine ricevuto', 'Il locale ha confermato.'], ['In preparazione', 'Lo spiedo gira, la piadina è sulla piastra.'], ['In consegna', 'Il rider è partito.'], ['Consegnato', 'Buon appetito!']];
  function ordine() {
    var box = $('#ord-box'), o = stato.attivo;
    clearInterval(timer);
    if (!o) { box.innerHTML = '<p class="empty">Nessun ordine in corso.</p><a class="btn hot full" href="#/menu">Ordina qualcosa</a>'; return; }
    var rit = o.modo === 'ritiro';
    box.innerHTML = '<div class="eta"><div><span>' + (rit ? 'Pronto tra' : 'Arriva tra') + '</span><br><b id="eta-min">--</b> <span>min</span></div><span>Ordine #' + o.n + '<br>' + euro(o.tot) + '</span></div>' +
      (rit ? '' : '<div class="mappa"><svg viewBox="0 0 400 220" role="img" aria-label="Mappa: il rider si sposta dal locale verso casa tua"><rect width="400" height="220" fill="#1A1715"/><g stroke="#2C2622" stroke-width="14" fill="none"><path d="M0 60h400M0 160h400M90 0v220M230 0v220M330 0v220"/></g><g stroke="#3A322D" stroke-width="1" stroke-dasharray="4 6" fill="none"><path d="M0 60h400M0 160h400M90 0v220M230 0v220M330 0v220"/></g><path id="rotta" d="M60 60H230V160H330" fill="none" stroke="#FF6B1A" stroke-width="4" stroke-linecap="round" stroke-dasharray="8 8"/><g transform="translate(60 60)"><circle r="12" fill="#FFC23D"/><path d="M-5 -3h10l-2 6h-6z" fill="#141110"/></g><g transform="translate(330 160)"><circle r="12" fill="#F6EFE6"/><path d="M-6 2 0-5 6 2v5h-12z" fill="#141110"/></g><circle id="moto" r="9" fill="#FF6B1A" stroke="#141110" stroke-width="3" cx="60" cy="60"/></svg></div>') +
      '<ol class="steps" id="fasi">' + FASI.map(function (f, i) { return '<li data-f="' + i + '"><div><b>' + (rit && i === 2 ? 'Pronto al banco' : f[0]) + '</b><small>' + (rit && i === 2 ? 'Ti aspettiamo al locale.' : rit && i === 3 ? 'Ritirato. Buon appetito!' : f[1]) + '</small></div></li>'; }).join('') + '</ol>' +
      (rit ? '' : '<div class="rider"><span class="av" aria-hidden="true">MB</span><div><b>Marco, il tuo rider</b><small>Scooter elettrico · nome di esempio</small></div></div>') +
      '<p class="nota">Simulazione: le fasi avanzano da sole per mostrare come lo vede il cliente. Hai guadagnato ' + o.timbri + (o.timbri === 1 ? ' timbro' : ' timbri') + ' sulla tessera.</p>';
    var tot = 32, start = o.quando, rotta = $('#rotta');
    function tick() {
      var sec = (Date.now() - start) / 1000, fase = Math.min(3, Math.floor(sec / 6));
      $$('#fasi li').forEach(function (li, i) { li.classList.toggle('fatto', i <= fase); li.classList.toggle('ora', i === fase && fase < 3); });
      var min = Math.max(0, Math.round(tot - sec * 1.3)); if (fase === 3) min = 0;
      $('#eta-min').textContent = min;
      if (rotta) {
        var k = fase < 2 ? 0 : fase === 3 ? 1 : Math.min(1, (sec - 12) / 6);
        var pt = rotta.getPointAtLength(rotta.getTotalLength() * k); var moto = $('#moto');
        if (moto) { moto.setAttribute('cx', pt.x); moto.setAttribute('cy', pt.y); }
      }
      if (fase === 3) clearInterval(timer);
    }
    tick(); timer = setInterval(tick, 500);
  }

  /* ---------- PROFILO ---------- */
  function profilo() {
    var p = stato.punti, t = '';
    for (var i = 1; i <= 10; i++) t += '<i class="' + (i <= p ? 'on' : '') + '" aria-hidden="true">' + (i === 10 ? 'FREE' : i) + '</i>';
    $('#punti').innerHTML = '<h2>Tessera Spiedo</h2><p>' + (p >= 10 ? 'Tessera piena: il prossimo kebab è offerto da noi.' : 'Un timbro ogni 10 € di spesa. Ti mancano ' + (10 - p) + ' timbri per un kebab offerto.') + '</p><div class="timbri" role="img" aria-label="' + p + ' timbri su 10">' + t + '</div>';
    var ord = stato.ordini.slice(0, 4).map(function (o) { return '<li><b>Ordine #' + o.n + ' · ' + euro(o.tot) + '</b><span>' + esc(o.righe) + '</span></li>'; });
    if (!ord.length) ord = ['<li><b>Ordine #1031 · 15,50 €</b><span>1× Dürüm, 1× Patatine speziate, 1× Ayran</span></li>', '<li><b>Ordine #1019 · 19,00 €</b><span>2× Kebab classico, 2× Bibita in lattina</span></li>'];
    $('#storico').innerHTML = ord.join('');
  }

  var RENDER = { home: home, menu: menu, prodotto: prodotto, carrello: carrello, ordine: ordine, profilo: profilo };
  function route() {
    var p = location.hash.replace(/^#\/?/, '').split('/'), nome = RENDER[p[0]] ? p[0] : 'home';
    if (nome !== 'ordine') clearInterval(timer);
    $$('[data-screen]').forEach(function (s) { s.hidden = s.dataset.screen !== nome; });
    var tab = nome === 'prodotto' ? 'menu' : nome;
    $$('.tabbar a').forEach(function (a) { if (a.dataset.tab === tab) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    RENDER[nome](p[1]);
    window.scrollTo(0, 0); var sc = document.querySelector('.app > main'); if (sc) sc.scrollTop = 0;
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest('button'); if (!t) return;
    if (t.dataset.cat) { menuCat = t.dataset.cat; $('#cerca').value = ''; menu(); }
    else if (t.dataset.q) { var f = $('#p-form'); f.dataset.q = Math.max(1, Math.min(9, +f.dataset.q + +t.dataset.q)); aggiornaPrezzo(); }
    else if (t.dataset.cq) { var r = cart[+t.dataset.i]; r.q += +t.dataset.cq; if (r.q < 1) { cart.splice(+t.dataset.i, 1); toast('Tolto dal carrello'); } salva(); carrello(); }
    else if (t.dataset.modo) { stato.modo = t.dataset.modo; salva(); carrello(); }
    else if (t.id === 'invia') invia();
  });
  document.addEventListener('change', function (e) { if (e.target.closest('#p-form')) aggiornaPrezzo(); });
  document.addEventListener('submit', function (e) {
    e.preventDefault();
    if (e.target.id === 'p-form') {
      var s = scelte(), q = +e.target.dataset.q, ex = cart.filter(function (r) { return r.id === s.m.id && r.nota === s.nota; })[0];
      if (ex) ex.q += q; else cart.push({ id: s.m.id, n: s.m.n, unit: s.unit, nota: s.nota, q: q });
      salva(); toast(s.m.n + ' aggiunto al carrello'); location.hash = '#/menu';
    } else if (e.target.id === 'f-codice') {
      var v = $('#codice').value.trim().toUpperCase();
      if (CODICI[v]) { stato.codice = v; salva(); carrello(); toast('Sconto del 10% applicato'); }
      else { var m = $('#codice-msg'); m.className = 'msg err'; m.textContent = v ? 'Questo codice non esiste. Prova NERO10.' : 'Scrivi un codice.'; }
    }
  });
  $('#cerca').addEventListener('input', lista);
  window.addEventListener('hashchange', route);
  badge(); route();
})();
