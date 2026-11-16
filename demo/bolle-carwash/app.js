/* Bolle - app dimostrativa. Nessun dato viene inviato: prenotazioni e ordini del bar restano nel browser. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var euro = function (n) { return (n % 1 ? n.toFixed(2).replace('.', ',') : n) + ' €'; };
  var mem = {
    get: function (k, d) { try { var v = localStorage.getItem('bolle-' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('bolle-' + k, JSON.stringify(v)); } catch (e) {} }
  };
  var VEI = [
    ['city', 'Utilitaria', 0, '<svg viewBox="0 0 44 26"><path d="M6 18v-5l5-6h16l6 6h4v5z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><circle cx="13" cy="19" r="3.2" fill="currentColor"/><circle cx="31" cy="19" r="3.2" fill="currentColor"/></svg>'],
    ['suv', 'SUV o berlina', 6, '<svg viewBox="0 0 44 26"><path d="M3 19v-7l4-6h22l6 6h6v7z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><circle cx="11" cy="20" r="3.4" fill="currentColor"/><circle cx="33" cy="20" r="3.4" fill="currentColor"/></svg>'],
    ['van', 'Furgone', 12, '<svg viewBox="0 0 44 26"><path d="M3 19V4h26l6 7h6v8z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><circle cx="11" cy="20" r="3.4" fill="currentColor"/><circle cx="33" cy="20" r="3.4" fill="currentColor"/></svg>']
  ];
  var PROG = [
    { id: 'fuori', n: 'Esterno', p: 15, min: 25, d: ['Prelavaggio con schiuma attiva', 'Lavaggio a mano con guanto', 'Cerchi e passaruota', 'Asciugatura con panno in microfibra'] },
    { id: 'misto', n: 'Esterno e interni', p: 25, min: 45, top: 1, d: ['Tutto il lavaggio esterno', 'Aspirazione di sedili e tappetini', 'Plastiche e cruscotto', 'Vetri dentro e fuori'] },
    { id: 'completo', n: 'Completo', p: 55, min: 120, d: ['Esterno e interni', 'Sedili lavati a vapore o pelle nutrita', 'Bagagliaio e portiere', 'Cera protettiva a mano'] },
    { id: 'interni', n: 'Igienizzazione interni', p: 40, min: 60, d: ['Vapore su sedili e moquette', 'Trattamento del climatizzatore', 'Per chi viaggia con animali o bambini'] }
  ];
  var EXTRA = [['cera', 'Cera a mano', 'Protegge la vernice per circa un mese', 10], ['cerchi', 'Cerchi lucidati', 'Pulizia profonda e protezione', 8], ['odore', 'Profumo per l\'abitacolo', 'Fragranza leggera, senza alcol', 3]];
  var BAR = [['caffe', 'Caffè', 1.2], ['cappuccino', 'Cappuccino', 1.6], ['cornetto', 'Cornetto', 1.3], ['spremuta', 'Spremuta d\'arancia', 3], ['acqua', 'Acqua 50 cl', 1]];
  var st = mem.get('stato', { v: 'city', lavaggi: 6, storico: [], attiva: null, bar: {} });
  var sel = { p: 'misto', ex: [], slot: null };
  var byId = function (id) { return PROG.filter(function (p) { return p.id === id; })[0]; };
  var vei = function (id) { return VEI.filter(function (v) { return v[0] === id; })[0]; };
  var durata = function (m) { return m >= 60 ? (m / 60) + (m === 60 ? ' ora' : ' ore') : m + ' min'; };
  function toast(t) { var el = $('#toast'); el.textContent = t; el.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(function () { el.classList.remove('on'); }, 2400); }
  function salva() { mem.set('stato', st); }
  var veicoliHtml = function () { return VEI.map(function (v) { return '<button type="button" data-v="' + v[0] + '" aria-pressed="' + (st.v === v[0]) + '">' + v[3] + v[1] + '</button>'; }).join(''); };

  /* coda simulata: cambia con l'ora del giorno */
  function coda() { var h = new Date().getHours(), n = h < 8 || h >= 19 ? 0 : (h * 7) % 4; $('#coda').innerHTML = '<i aria-hidden="true"></i>' + (n ? n + (n === 1 ? ' auto' : ' auto') + ' in coda' : 'Nessuna coda'); }

  function home() {}
  function programmi() {
    $('#veicoli').innerHTML = veicoliHtml();
    var extra = vei(st.v)[2];
    $('#prog-list').innerHTML = PROG.map(function (p) { return '<li class="' + (p.top ? 'best' : '') + '">' + (p.top ? '<span class="badge-top">Il più scelto</span>' : '') + '<div class="head"><h2>' + p.n + '</h2><span class="pr">' + euro(p.p + extra) + '</span></div><span class="min">circa ' + durata(p.min) + '</span><ul>' + p.d.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul><a href="#/prenota/' + p.id + '">Prenota questo</a></li>'; }).join('');
  }
  function slots() {
    var ora = new Date(), out = [], d = new Date(ora);
    d.setMinutes(d.getMinutes() < 30 ? 30 : 60, 0, 0); if (d.getMinutes() === 60) d.setMinutes(0);
    for (var g = 0; out.length < 8 && g < 3; g++) {
      for (var h = 8; h < 19 && out.length < 8; h++) for (var m = 0; m < 60 && out.length < 8; m += 30) {
        var s = new Date(ora); s.setDate(s.getDate() + g); s.setHours(h, m, 0, 0);
        if (s > d && s.getDay() !== 0) out.push({ id: s.getDate() + '-' + h + '-' + m, ora: h + ':' + (m ? '30' : '00'), g: g === 0 ? 'oggi' : g === 1 ? 'domani' : ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'][s.getDay()], pieno: (h + m + s.getDate()) % 4 === 0 });
      }
    }
    return out;
  }
  function prenota(id) {
    if (id && byId(id)) sel.p = id;
    $('#p-veicoli').innerHTML = veicoliHtml();
    var extra = vei(st.v)[2];
    $('#p-prog').innerHTML = PROG.map(function (p) { return '<label><input type="radio" name="prog" value="' + p.id + '"' + (sel.p === p.id ? ' checked' : '') + '><span>' + p.n + '<small>circa ' + durata(p.min) + '</small></span><em>' + euro(p.p + extra) + '</em></label>'; }).join('');
    $('#p-extra').innerHTML = EXTRA.map(function (e) { return '<label><input type="checkbox" name="ex" value="' + e[0] + '"' + (sel.ex.indexOf(e[0]) > -1 ? ' checked' : '') + '><span>' + e[1] + '<small>' + e[2] + '</small></span><em>+' + euro(e[3]) + '</em></label>'; }).join('');
    var sl = slots(); if (sel.slot && !sl.some(function (s) { return s.id === sel.slot && !s.pieno; })) sel.slot = null;
    $('#p-slot').innerHTML = sl.map(function (s) { return '<button type="button" data-slot="' + s.id + '" data-ora="' + s.ora + '" data-g="' + s.g + '" aria-pressed="' + (sel.slot === s.id) + '"' + (s.pieno ? ' disabled aria-label="' + s.g + ' ' + s.ora + ', pieno"' : '') + '><small>' + s.g + '</small>' + s.ora + '</button>'; }).join('');
    totale();
  }
  function conto() {
    var p = byId(sel.p), v = vei(st.v), r = [[p.n + ' · ' + v[1].toLowerCase(), p.p + v[2]]];
    sel.ex.forEach(function (x) { var e = EXTRA.filter(function (y) { return y[0] === x; })[0]; r.push([e[1], e[3]]); });
    return { r: r, tot: r.reduce(function (a, x) { return a + x[1]; }, 0) };
  }
  function totale() {
    var c = conto();
    $('#p-tot').innerHTML = c.r.map(function (x) { return '<p><span>' + x[0] + '</span><span>' + euro(x[1]) + '</span></p>'; }).join('') + '<p class="g"><span>Totale</span><span>' + euro(c.tot) + '</span></p>';
    $('#p-ok').disabled = !sel.slot; $('#p-ok').textContent = sel.slot ? 'Conferma (demo)' : 'Scegli un orario';
  }
  var t = null;
  function attesa() {
    clearInterval(t);
    var a = st.attiva, box = $('#att-box');
    if (!a) box.innerHTML = '<p class="vuoto">Nessuna auto da noi in questo momento. <a href="#/prenota">Prenota un lavaggio</a></p>';
    else {
      box.innerHTML = '<div class="stato"><div class="riga"><span><small>' + a.prog + ' · ' + (a.targa || 'la tua auto') + '</small><br><b class="min" id="a-min">--</b> <small>min alla fine</small></span><small>' + a.g + ' ' + a.ora + '</small></div><div class="barra"><i id="a-bar" style="width:0"></i></div><ol class="fasi" id="a-fasi"><li>Accettata</li><li>Schiuma</li><li>Interni</li><li>Pronta</li></ol></div><p class="nota">Simulazione: la barra avanza da sola per mostrare cosa vede il cliente.</p>';
      var tick = function () {
        var k = Math.min(1, (Date.now() - a.start) / 24000);
        $('#a-bar').style.width = Math.round(k * 100) + '%';
        $('#a-min').textContent = Math.max(0, Math.round(a.min * (1 - k)));
        $$('#a-fasi li').forEach(function (li, i) { li.classList.toggle('on', k >= i / 3 - .001); });
        if (k >= 1) clearInterval(t);
      };
      tick(); t = setInterval(tick, 400);
    }
    $('#bar').innerHTML = BAR.map(function (b) { var n = st.bar[b[0]] || 0; return '<li><div><b>' + b[1] + '</b><small>' + euro(b[2]) + '</small></div>' + (n ? '<button type="button" data-bar="' + b[0] + '" data-d="-1" aria-label="Togli ' + b[1] + '">−</button><span class="n">' + n + '</span>' : '') + '<button type="button" data-bar="' + b[0] + '" data-d="1" aria-label="Aggiungi ' + b[1] + '">+</button></li>'; }).join('');
    var tot = BAR.reduce(function (s, b) { return s + (st.bar[b[0]] || 0) * b[2]; }, 0);
    $('#conto-bar').innerHTML = tot ? '<button class="btn blu full" type="button" id="ordina-bar">Portatemelo in sala · ' + euro(Math.round(tot * 100) / 100) + '</button>' : '';
  }
  function tessera() {
    var g = ''; for (var i = 1; i <= 10; i++) g += '<i class="' + (i <= st.lavaggi ? 'on' : '') + '"></i>';
    $('#tess').innerHTML = '<h2>' + (st.lavaggi >= 10 ? 'Il prossimo esterno è gratis' : st.lavaggi + ' lavaggi su 10') + '</h2><p>Al decimo lavaggio, un esterno lo offriamo noi.</p><div class="gocce" role="img" aria-label="' + st.lavaggi + ' su 10">' + g + '</div>';
    var s = st.storico.length ? st.storico : [{ prog: 'Esterno e interni', g: '2 novembre', tot: 25 }, { prog: 'Esterno', g: '18 ottobre', tot: 15 }];
    $('#storico').innerHTML = s.map(function (x) { return '<li><b>' + x.prog + ' · ' + euro(x.tot) + '</b><small>' + x.g + (x.ora ? ' alle ' + x.ora : '') + '</small></li>'; }).join('');
  }
  var R = { home: home, programmi: programmi, prenota: prenota, attesa: attesa, tessera: tessera };
  function route() {
    var p = location.hash.replace(/^#\/?/, '').split('/'), n = R[p[0]] ? p[0] : 'home';
    if (n !== 'attesa') clearInterval(t);
    $$('[data-screen]').forEach(function (s) { s.hidden = s.dataset.screen !== n; });
    $$('.tabbar a').forEach(function (a) { if (a.dataset.tab === n) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    R[n](p[1]); window.scrollTo(0, 0); var sc = document.querySelector('.app > main'); if (sc) sc.scrollTop = 0;
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.dataset.v) { st.v = b.dataset.v; salva(); if (b.closest('#p-veicoli')) prenota(); else programmi(); }
    else if (b.dataset.slot) { sel.slot = b.dataset.slot; sel.ora = b.dataset.ora; sel.g = b.dataset.g; prenota(); }
    else if (b.dataset.bar) { st.bar[b.dataset.bar] = Math.max(0, (st.bar[b.dataset.bar] || 0) + +b.dataset.d); salva(); attesa(); }
    else if (b.id === 'ordina-bar') { st.bar = {}; salva(); toast('Ordine passato al bar: arriva al tuo tavolo'); attesa(); }
  });
  $('#f-pren').addEventListener('change', function (e) {
    if (e.target.name === 'prog') sel.p = e.target.value;
    if (e.target.name === 'ex') sel.ex = $$('input[name=ex]:checked').map(function (i) { return i.value; });
    totale();
  });
  $('#f-pren').addEventListener('submit', function (e) {
    e.preventDefault();
    var tg = $('#targa').value.trim().toUpperCase().replace(/\s/g, ''), err = $('#e-targa');
    if (tg && !/^[A-Z]{2}\d{3}[A-Z]{2}$/.test(tg)) { err.textContent = 'La targa va scritta come AB123CD, oppure lasciala vuota.'; $('#targa').focus(); return; }
    err.textContent = '';
    if (!sel.slot) return;
    var c = conto(), p = byId(sel.p);
    st.attiva = { prog: p.n, targa: tg, ora: sel.ora, g: sel.g, min: p.min, start: Date.now() };
    st.storico.unshift({ prog: p.n, g: sel.g, ora: sel.ora, tot: c.tot }); st.lavaggi = Math.min(10, st.lavaggi + 1);
    sel.slot = null; salva(); location.hash = '#/attesa';
  });
  window.addEventListener('hashchange', route);
  coda(); route();
})();
