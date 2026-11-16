/* Onda Sushi - app dimostrativa. Nessun dato viene inviato: carrello e ordini restano nel browser. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var euro = function (n) { return n.toFixed(2).replace('.', ',') + ' €'; };
  var mem = {
    get: function (k, d) { try { var v = localStorage.getItem('ondasushi-' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('ondasushi-' + k, JSON.stringify(v)); } catch (e) {} }
  };
  var ICO = {
    nigiri: '<svg viewBox="0 0 64 64"><ellipse cx="32" cy="40" rx="20" ry="9" fill="#fff" stroke="#D8CFBF"/><path d="M12 36c4-10 36-10 40 0-8 5-32 5-40 0z" fill="#F08A5D"/><path d="M20 31l4 6M30 29l3 7M40 30l2 6" stroke="#FBD2BC" stroke-width="2"/></svg>',
    maki: '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="20" fill="#1F2A24"/><circle cx="32" cy="32" r="15" fill="#fff"/><circle cx="29" cy="30" r="5" fill="#F08A5D"/><circle cx="36" cy="35" r="4" fill="#8DBF6A"/></svg>',
    tempura: '<svg viewBox="0 0 64 64"><path d="M14 46c6-20 22-30 38-30-4 18-18 30-38 30z" fill="#E9B65C"/><path d="M20 40l6-4M26 34l7-5M33 28l7-4" stroke="#C98E33" stroke-width="2"/><path d="M50 18l6-6" stroke="#E2603F" stroke-width="3" stroke-linecap="round"/></svg>',
    bowl: '<svg viewBox="0 0 64 64"><path d="M10 30h44c0 14-10 22-22 22S10 44 10 30z" fill="#23305A"/><ellipse cx="32" cy="30" rx="22" ry="6" fill="#fff"/><circle cx="25" cy="29" r="4" fill="#F08A5D"/><circle cx="37" cy="28" r="4" fill="#8DBF6A"/></svg>',
    drink: '<svg viewBox="0 0 64 64"><path d="M22 14h20l-3 38H25z" fill="#CFE3D8" stroke="#8FB3A1" stroke-width="2"/><path d="M24 26h16" stroke="#8FB3A1" stroke-width="2"/></svg>',
    dolce: '<svg viewBox="0 0 64 64"><circle cx="24" cy="36" r="10" fill="#F3B9C6"/><circle cx="40" cy="36" r="10" fill="#B8D99B"/><circle cx="32" cy="26" r="10" fill="#FFF3D6"/></svg>'
  };
  var CATS = [['barche', 'Barche'], ['nigiri', 'Nigiri'], ['roll', 'Roll'], ['caldi', 'Piatti caldi'], ['bowl', 'Poke'], ['bevande', 'Bevande'], ['dolci', 'Dolci']];
  var MENU = [
    { id: 'barca', c: 'barche', n: 'Barca Onda per due', d: '8 nigiri, 16 uramaki, 12 hosomaki, sashimi di salmone e tonno.', p: 34, was: 42, img: 'img/tagliere.webp', pz: [['36 pezzi', 0]], all: ['Pesce', 'Sesamo', 'Soia'], chef: 1 },
    { id: 'barca1', c: 'barche', n: 'Barca piccola', d: '4 nigiri, 8 uramaki, 6 hosomaki.', p: 19, ico: 'maki', pz: [['18 pezzi', 0]], all: ['Pesce', 'Sesamo', 'Soia'] },
    { id: 'flambe', c: 'nigiri', n: 'Nigiri salmone scottato', d: 'Salmone passato alla fiamma, lime e salsa teriyaki.', p: 6, img: 'img/nigiri.webp', all: ['Pesce', 'Soia', 'Glutine'], chef: 1 },
    { id: 'nsake', c: 'nigiri', n: 'Nigiri salmone', d: 'Salmone norvegese su riso.', p: 4.5, ico: 'nigiri', all: ['Pesce'] },
    { id: 'nmaguro', c: 'nigiri', n: 'Nigiri tonno', d: 'Tonno pinna gialla su riso.', p: 5.5, ico: 'nigiri', all: ['Pesce'] },
    { id: 'ura', c: 'roll', n: 'Uramaki salmone e avocado', d: 'Riso fuori, sesamo tostato.', p: 9, ico: 'maki', all: ['Pesce', 'Sesamo'], roll: 1 },
    { id: 'crunch', c: 'roll', n: 'Crunch roll', d: 'Gambero in tempura, maionese piccante, briciole croccanti.', p: 11, ico: 'tempura', all: ['Crostacei', 'Glutine', 'Uova'], roll: 1, chef: 1 },
    { id: 'veg', c: 'roll', n: 'Roll vegetale', d: 'Cetriolo, avocado, mango e germogli.', p: 8, ico: 'maki', all: ['Sesamo'], roll: 1, veg: 1 },
    { id: 'tempura', c: 'caldi', n: 'Tempura di gamberi', d: 'Cinque gamberi in pastella leggera.', p: 10, ico: 'tempura', all: ['Crostacei', 'Glutine'] },
    { id: 'gyoza', c: 'caldi', n: 'Gyoza alla piastra', d: 'Ravioli di maiale e verza, sei pezzi.', p: 7, ico: 'tempura', all: ['Glutine', 'Soia'] },
    { id: 'poke', c: 'bowl', n: 'Poke salmone', d: 'Riso, salmone, avocado, edamame, mango e alga wakame.', p: 13, img: 'img/poke.webp', all: ['Pesce', 'Soia', 'Sesamo'], chef: 1 },
    { id: 'pokeveg', c: 'bowl', n: 'Poke tofu', d: 'Riso integrale, tofu marinato, verdure croccanti.', p: 11, ico: 'bowl', all: ['Soia', 'Sesamo'], veg: 1 },
    { id: 'te', c: 'bevande', n: 'Tè verde freddo', d: 'Preparato da noi, poco zucchero.', p: 3, ico: 'drink', all: [] },
    { id: 'acqua', c: 'bevande', n: 'Acqua 50 cl', d: 'Naturale o frizzante.', p: 1.5, ico: 'drink', all: [] },
    { id: 'mochi', c: 'dolci', n: 'Mochi misti', d: 'Tre pezzi: tè matcha, fragola, sesamo nero.', p: 6, ico: 'dolce', all: ['Latte', 'Sesamo'] }
  ];
  var EXTRA = [['Salsa teriyaki', .5], ['Maionese piccante', .5], ['Zenzero in più', .5], ['Bacchette in più', 0]];
  var CODICI = { ONDA5: 5 };
  var byId = function (id) { return MENU.filter(function (m) { return m.id === id; })[0]; };
  var thumb = function (m, cls) { return m.img ? '<img class="th ' + (cls || '') + '" src="' + m.img + '" alt="" loading="lazy" width="300" height="300">' : '<span class="th ' + (cls || '') + '" aria-hidden="true">' + ICO[m.ico] + '</span>'; };
  var porzioni = function (m) { return m.pz || (m.roll ? [['8 pezzi', 0], ['12 pezzi', 4]] : m.c === 'nigiri' ? [['2 pezzi', 0], ['4 pezzi', m.p]] : [['Normale', 0]]); };

  var cart = mem.get('carrello', []);
  var st = mem.get('stato', { mancia: 0, orario: 'Prima possibile', codice: '', ordini: [] });
  var cat = 'barche';

  function toast(t) { var el = $('#toast'); el.textContent = t; el.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(function () { el.classList.remove('on'); }, 2400); }
  function salva() { mem.set('carrello', cart); mem.set('stato', st); var n = cart.reduce(function (a, r) { return a + r.q; }, 0); $('#badge').hidden = !n; $('#badge').textContent = n; }

  /* conto alla rovescia fino a mezzanotte */
  var cd = null;
  function countdown() {
    var d = new Date(), fine = new Date(d); fine.setHours(23, 59, 59, 0);
    var s = Math.max(0, Math.floor((fine - d) / 1000)), p = function (n) { return (n < 10 ? '0' : '') + n; };
    var el = $('#countdown'); if (el) el.textContent = p(Math.floor(s / 3600)) + ':' + p(Math.floor(s % 3600 / 60)) + ':' + p(s % 60);
  }
  function home() {
    $('#home-cats').innerHTML = CATS.slice(0, 6).map(function (c) { return '<a href="#/menu/' + c[0] + '">' + c[1] + '</a>'; }).join('');
    $('#home-chef').innerHTML = MENU.filter(function (m) { return m.chef && m.id !== 'barca'; }).map(function (m) {
      return '<li><a href="#/piatto/' + m.id + '">' + thumb(m) + '<span><b>' + m.n + '</b><small>' + m.d + '</small><span class="pr">' + euro(m.p) + '</span></span></a></li>';
    }).join('');
    countdown(); clearInterval(cd); cd = setInterval(countdown, 1000);
  }
  function menu(c) {
    if (c) cat = c;
    $('#menu-tabs').innerHTML = CATS.map(function (x) { return '<button type="button" data-cat="' + x[0] + '" aria-pressed="' + (x[0] === cat) + '">' + x[1] + '</button>'; }).join('');
    lista();
  }
  function lista() {
    var q = $('#cerca').value.trim().toLowerCase();
    var v = MENU.filter(function (m) { return q ? (m.n + ' ' + m.d + (m.veg ? ' veg vegetariano' : '')).toLowerCase().indexOf(q) > -1 : m.c === cat; });
    $('#menu-list').innerHTML = v.map(function (m) {
      return '<li><a href="#/piatto/' + m.id + '">' + thumb(m) + '<span class="tx"><b>' + m.n + '</b>' + (m.veg ? '<span><span class="pill">Vegetariano</span></span>' : '') + '<small>' + porzioni(m)[0][0] + '</small><span class="pr">' + euro(m.p) + '</span></span></a></li>';
    }).join('');
    $('#menu-vuoto').hidden = v.length > 0;
  }
  function piatto(id) {
    var m = byId(id) || MENU[0];
    $('#d-head').innerHTML = thumb(m, 'd-img') + '<h1 id="d-nome">' + m.n + '</h1><p class="d-desc">' + m.d + '</p>';
    var pz = porzioni(m);
    var h = '<fieldset><legend>Porzione</legend><div class="opz">' + pz.map(function (o, i) { return '<label><input type="radio" name="pz" value="' + o[0] + '" data-p="' + o[1] + '"' + (i ? '' : ' checked') + '>' + o[0] + (o[1] ? '<em>+' + euro(o[1]) + '</em>' : '') + '</label>'; }).join('') + '</div></fieldset>';
    if (m.c !== 'bevande' && m.c !== 'dolci') h += '<fieldset><legend>Aggiungi</legend>' + EXTRA.map(function (e) { return '<label class="riga"><input type="checkbox" name="ex" value="' + e[0] + '" data-p="' + e[1] + '">' + e[0] + '<em>' + (e[1] ? '+' + euro(e[1]) : 'gratis') + '</em></label>'; }).join('') + '</fieldset>';
    h += '<fieldset><legend>Allergeni</legend><div class="allergeni">' + (m.all.length ? m.all.map(function (a) { return '<span>' + a + '</span>'; }).join('') : '<span>Nessuno dei 14 principali</span>') + '</div><p class="ingr">Il pesce crudo è abbattuto a −20 °C come richiesto dalla legge. Per intolleranze gravi scrivici nelle note dell\'ordine.</p></fieldset>';
    h += '<div class="addbar"><div class="qty"><button type="button" data-q="-1" aria-label="Uno in meno">−</button><output id="d-q">1</output><button type="button" data-q="1" aria-label="Uno in più">+</button></div><button class="btn rosso" type="submit" id="d-add"></button></div>';
    var f = $('#d-form'); f.innerHTML = h; f.dataset.id = m.id; f.dataset.n = 1; prezzo();
  }
  function scelta() {
    var f = $('#d-form'), m = byId(f.dataset.id), add = 0, nota = [];
    $$('input:checked', f).forEach(function (i) { add += +i.dataset.p; if (i.name === 'ex' || porzioni(m).length > 1) nota.push(i.value); });
    return { m: m, unit: m.p + add, nota: nota.join(', ') };
  }
  function prezzo() { var f = $('#d-form'), s = scelta(); $('#d-q').textContent = f.dataset.n; $('#d-add').textContent = 'Aggiungi · ' + euro(s.unit * f.dataset.n); }

  function conti() {
    var sub = cart.reduce(function (a, r) { return a + r.unit * r.q; }, 0), sc = st.codice && sub >= 25 ? CODICI[st.codice] || 0 : 0;
    return { sub: sub, sc: sc, cons: sub && sub < 30 ? 2.5 : 0, mancia: sub ? st.mancia : 0, tot: sub - sc + (sub && sub < 30 ? 2.5 : 0) + (sub ? st.mancia : 0) };
  }
  function carrello() {
    var b = $('#cart-box');
    if (!cart.length) { b.innerHTML = '<p class="empty">Il carrello è vuoto.</p><a class="btn rosso full" href="#/menu">Sfoglia il menu</a>'; return; }
    var c = conti(), orari = ['Prima possibile', '20:00', '20:30', '21:00', '21:30'];
    b.innerHTML = '<ul class="cart-l">' + cart.map(function (r, i) { return '<li><b>' + r.n + '</b><div class="qty"><button type="button" data-cq="-1" data-i="' + i + '" aria-label="Uno in meno: ' + r.n + '">−</button><output>' + r.q + '</output><button type="button" data-cq="1" data-i="' + i + '" aria-label="Uno in più: ' + r.n + '">+</button></div><small>' + (r.nota || 'Porzione standard') + ' · ' + euro(r.unit * r.q) + '</small></li>'; }).join('') + '</ul>' +
      '<p class="h3">Quando lo vuoi</p><div class="chips" role="group" aria-label="Orario di consegna">' + orari.map(function (o) { return '<button type="button" data-ora="' + o + '" aria-pressed="' + (st.orario === o) + '">' + o + '</button>'; }).join('') + '</div>' +
      '<p class="h3">Mancia al rider</p><div class="chips" role="group" aria-label="Mancia">' + [0, 1, 2, 3].map(function (m) { return '<button type="button" data-mancia="' + m + '" aria-pressed="' + (st.mancia === m) + '">' + (m ? m + ' €' : 'No') + '</button>'; }).join('') + '</div>' +
      '<p class="h3">Codice sconto</p><form class="codice" id="f-cod" novalidate><label class="sr" for="cod">Codice sconto</label><input id="cod" value="' + st.codice + '" placeholder="Es. ONDA5" autocomplete="off"><button class="btn" type="submit">Applica</button></form>' +
      '<p class="msg' + (c.sc ? ' ok' : '') + '" id="cod-msg">' + (c.sc ? 'ONDA5 applicato: −5 €.' : st.codice ? 'ONDA5 vale da 25 € di spesa.' : 'Codice di prova: ONDA5 (da 25 € in su).') + '</p>' +
      '<div class="tot"><p><span>Piatti</span><span>' + euro(c.sub) + '</span></p>' + (c.sc ? '<p><span>Sconto</span><span>−' + euro(c.sc) + '</span></p>' : '') + '<p><span>Consegna</span><span>' + (c.cons ? euro(c.cons) : 'Gratis') + '</span></p>' + (c.mancia ? '<p><span>Mancia</span><span>' + euro(c.mancia) + '</span></p>' : '') + '<p class="g"><span>Totale</span><span>' + euro(c.tot) + '</span></p></div>' +
      '<button class="btn rosso full" type="button" id="ordina">Conferma l\'ordine (demo)</button><p class="nota">Demo: nessun ordine parte e non si paga niente. Consegna gratis da 30 €.</p>';
  }
  function ordini() {
    var b = $('#ord-box'), o = st.ordini[0];
    var ultimo = o ? '<div class="conf"><h2>Ordine ricevuto</h2><p>N. ' + o.n + ' · ' + euro(o.tot) + '</p><div class="ora">' + (o.orario === 'Prima possibile' ? 'tra circa 40 min' : 'alle ' + o.orario) + '</div><div class="prog" aria-hidden="true"><i class="on"></i><i class="on"></i><i></i></div><div class="prog-l"><span>Confermato</span><span>Lo chef prepara</span><span>In consegna</span></div></div>' : '<p class="empty">Non hai ancora ordinato niente.</p><a class="btn rosso full" href="#/home">Guarda l\'offerta di oggi</a>';
    var vecchi = st.ordini.slice(o ? 1 : 0, 4).concat([{ n: 2207, tot: 41, righe: '1× Barca Onda per due, 2× Mochi misti', data: '3 novembre' }]);
    b.innerHTML = ultimo + '<p class="h3">Ordini passati</p><ul class="ord-l">' + vecchi.map(function (x) { return '<li><b>N. ' + x.n + ' · ' + euro(x.tot) + '</b><span>' + (x.data ? x.data + ' · ' : '') + x.righe + '</span></li>'; }).join('') + '</ul><button class="btn full" type="button" id="ripeti">Ripeti l\'ultimo ordine</button><p class="nota">Storico di esempio: resta solo in questo browser.</p>';
  }
  var R = { home: home, menu: menu, piatto: piatto, carrello: carrello, ordini: ordini };
  function route() {
    var p = location.hash.replace(/^#\/?/, '').split('/'), n = R[p[0]] ? p[0] : 'home';
    if (n !== 'home') clearInterval(cd);
    $$('[data-screen]').forEach(function (s) { s.hidden = s.dataset.screen !== n; });
    var tab = n === 'piatto' ? 'menu' : n;
    $$('.tabbar a').forEach(function (a) { if (a.dataset.tab === tab) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    R[n](p[1]); window.scrollTo(0, 0); var sc = document.querySelector('.app > main'); if (sc) sc.scrollTop = 0;
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest('button'); if (!t) return;
    if (t.dataset.cat) { cat = t.dataset.cat; $('#cerca').value = ''; menu(); }
    else if (t.dataset.q) { var f = $('#d-form'); f.dataset.n = Math.max(1, Math.min(9, +f.dataset.n + +t.dataset.q)); prezzo(); }
    else if (t.dataset.cq) { var r = cart[+t.dataset.i]; r.q += +t.dataset.cq; if (r.q < 1) cart.splice(+t.dataset.i, 1); salva(); carrello(); }
    else if (t.dataset.ora) { st.orario = t.dataset.ora; salva(); carrello(); }
    else if (t.dataset.mancia) { st.mancia = +t.dataset.mancia; salva(); carrello(); }
    else if (t.id === 'ordina') {
      var c = conti(); st.ordini.unshift({ n: 2200 + st.ordini.length + 31, tot: c.tot, orario: st.orario, righe: cart.map(function (r) { return r.q + '× ' + r.n; }).join(', ') });
      cart = []; st.codice = ''; salva(); location.hash = '#/ordini';
    } else if (t.id === 'ripeti') { cart.push({ id: 'barca', n: 'Barca Onda per due', unit: 34, nota: '', q: 1 }); salva(); toast('Barca Onda per due aggiunta al carrello'); }
  });
  document.addEventListener('change', function (e) { if (e.target.closest('#d-form')) prezzo(); });
  document.addEventListener('submit', function (e) {
    e.preventDefault();
    if (e.target.id === 'd-form') {
      var s = scelta(), q = +e.target.dataset.n, ex = cart.filter(function (r) { return r.id === s.m.id && r.nota === s.nota; })[0];
      if (ex) ex.q += q; else cart.push({ id: s.m.id, n: s.m.n, unit: s.unit, nota: s.nota, q: q });
      salva(); toast(s.m.n + ' nel carrello'); location.hash = '#/menu';
    } else if (e.target.id === 'f-cod') {
      var v = $('#cod').value.trim().toUpperCase();
      if (CODICI[v]) { st.codice = v; salva(); carrello(); }
      else { var m = $('#cod-msg'); m.className = 'msg err'; m.textContent = v ? 'Codice non valido. Prova ONDA5.' : 'Scrivi un codice.'; }
    }
  });
  $('#cerca').addEventListener('input', lista);
  window.addEventListener('hashchange', route);
  salva(); route();
})();
