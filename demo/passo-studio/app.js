/* Passo Studio - app dimostrativa. Nessun dato viene inviato: la sneaker creata resta in questo browser. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var mem = {
    get: function (k, d) { try { var v = localStorage.getItem('passo-' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('passo-' + k, JSON.stringify(v)); } catch (e) {} }
  };
  var MOD = [
    { id: 'basso', n: 'Basso', d: 'La classica da tutti i giorni, profilo pulito.', p: 139 },
    { id: 'alto', n: 'Alto', d: 'Copre la caviglia, imbottitura in più.', p: 159 },
    { id: 'runner', n: 'Runner', d: 'Suola alta e morbida, per camminare tanto.', p: 149 }
  ];
  var PARTI = [['tomaia', 'Tomaia'], ['punta', 'Punta'], ['tallone', 'Tallone'], ['lacci', 'Lacci'], ['suola', 'Suola']];
  var COL = [['#F4F1EA', 'panna'], ['#111111', 'nero'], ['#2F4BFF', 'blu elettrico'], ['#C8553D', 'mattone'], ['#5F7A4F', 'salvia'], ['#D9B44A', 'senape'], ['#E8A5B5', 'rosa cipria'], ['#7A5135', 'cuoio'], ['#9AA3AD', 'grigio'], ['#1F3A5F', 'blu notte'], ['#B23A48', 'bordeaux'], ['#FFFFFF', 'bianco']];
  var MAT = [['pelle', 'Pelle liscia', 0], ['camoscio', 'Scamosciato', 15], ['tela', 'Tela di cotone', -10]];
  var TG = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47];
  var conf = mem.get('conf', { mod: 'basso', col: { tomaia: '#F4F1EA', punta: '#F4F1EA', tallone: '#2F4BFF', lacci: '#F4F1EA', suola: '#FFFFFF' }, mat: 'pelle', ini: '', tg: null });
  var parte = 'tomaia', vista = 'lato';
  var st = mem.get('stato', { borsa: [], ord: null, sped: 'casa' });
  var mod = function (id) { return MOD.filter(function (m) { return m.id === id; })[0]; };
  var matr = function (id) { return MAT.filter(function (m) { return m[0] === id; })[0]; };
  var nomeCol = function (h) { var c = COL.filter(function (x) { return x[0] === h; })[0]; return c ? c[1] : h; };
  var prezzo = function (c) { return mod(c.mod).p + matr(c.mat)[2] + (c.ini ? 10 : 0); };
  var salvaConf = function () { mem.set('conf', conf); };
  var salva = function () { mem.set('stato', st); $('#n-borsa').textContent = st.borsa.length; };
  var uid = 0;

  /* disegno della scarpa: ogni parte prende il suo colore; il materiale cambia la trama */
  function scarpa(c, v, piccola) {
    var k = 's' + (uid++), m = c.mod, col = c.col, alto = m === 'alto', run = m === 'runner';
    var trama = c.mat === 'camoscio' ? '<pattern id="' + k + 't" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".7" fill="#000" opacity=".12"/><circle cx="3.5" cy="3.5" r=".6" fill="#fff" opacity=".12"/></pattern>'
      : c.mat === 'tela' ? '<pattern id="' + k + 't" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M0 0h4M0 2h4" stroke="#000" stroke-width=".5" opacity=".12"/></pattern>'
      : '<linearGradient id="' + k + 't" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".25"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/></linearGradient>';
    var lbl = 'Anteprima: modello ' + mod(m).n + ', tomaia ' + nomeCol(col.tomaia) + ' in ' + matr(c.mat)[1].toLowerCase() + ', tallone ' + nomeCol(col.tallone) + (c.ini ? ', iniziali ' + c.ini : '');
    if (v === 'retro') {
      return '<svg class="scarpa" viewBox="0 0 360 200" role="img" aria-label="' + lbl + ', vista dal tallone"><defs>' + trama + '</defs><rect width="360" height="200" fill="#FFFFFF"/>' +
        '<path d="M120 ' + (alto ? 30 : 60) + ' Q180 ' + (alto ? 10 : 40) + ' 240 ' + (alto ? 30 : 60) + ' L250 165 L110 165 Z" fill="' + col.tomaia + '" stroke="#111" stroke-width="1.5"/><path d="M120 ' + (alto ? 30 : 60) + ' Q180 ' + (alto ? 10 : 40) + ' 240 ' + (alto ? 30 : 60) + ' L250 165 L110 165 Z" fill="url(#' + k + 't)"/>' +
        '<path d="M152 ' + (alto ? 22 : 52) + ' Q180 ' + (alto ? 14 : 44) + ' 208 ' + (alto ? 22 : 52) + ' L214 165 L146 165 Z" fill="' + col.tallone + '" stroke="#111" stroke-width="1.5"/>' +
        '<text x="180" y="125" text-anchor="middle" font-family="Manrope, sans-serif" font-weight="800" font-size="28" letter-spacing="4" fill="' + (col.tallone === '#111111' || col.tallone === '#1F3A5F' || col.tallone === '#2F4BFF' || col.tallone === '#B23A48' || col.tallone === '#7A5135' ? '#F4F1EA' : '#111') + '">' + (c.ini || '') + '</text>' +
        '<rect x="104" y="' + (run ? 158 : 163) + '" width="152" height="' + (run ? 26 : 18) + '" rx="6" fill="' + col.suola + '" stroke="#111" stroke-width="1.5"/>' + (c.ini ? '' : '<text x="180" y="125" text-anchor="middle" font-family="Manrope, sans-serif" font-size="12" fill="#6A6A66">qui vanno le iniziali</text>') + '</svg>';
    }
    var top = alto ? 'M42 142 L42 58 Q44 22 92 20 L140 24 Q166 42 196 42' : 'M42 142 L46 98 Q52 68 92 64 L148 60 Q168 40 198 40';
    var tomaia = top + ' L238 42 Q262 46 272 70 Q302 92 330 112 Q344 124 338 142 Z';
    var tallone = alto ? 'M42 142 L42 58 Q44 22 88 20 L94 142 Z' : 'M42 142 L46 98 Q52 70 82 66 L88 142 Z';
    var sy = run ? 132 : 142;
    var lacci = '';
    for (var i = 0; i < 5; i++) { var x = 172 + i * 18, y = 46 + i * 9; lacci += '<path d="M' + (x - 8) + ' ' + (y - 2) + 'l16 6" stroke="' + col.lacci + '" stroke-width="' + (piccola ? 4 : 3.2) + '" stroke-linecap="round"/><path d="M' + (x - 8) + ' ' + (y - 2) + 'l16 6" stroke="#111" stroke-width=".6" stroke-linecap="round" opacity=".4"/>'; }
    return '<svg class="scarpa" viewBox="0 0 360 200" role="img" aria-label="' + lbl + ', vista di lato"><defs>' + trama + '</defs><rect width="360" height="200" fill="#FFFFFF"/>' +
      '<path d="' + tomaia + '" fill="' + col.tomaia + '" stroke="#111" stroke-width="1.5"/><path d="' + tomaia + '" fill="url(#' + k + 't)"/>' +
      '<path d="M286 96 Q320 106 336 124 Q342 134 338 142 L280 142 Q274 116 286 96 Z" fill="' + col.punta + '" stroke="#111" stroke-width="1.5"/>' +
      '<path d="' + tallone + '" fill="' + col.tallone + '" stroke="#111" stroke-width="1.5"/>' +
      (c.ini && !piccola ? '<text x="65" y="' + (alto ? 96 : 118) + '" text-anchor="middle" font-family="Manrope, sans-serif" font-weight="800" font-size="11" letter-spacing="1" fill="' + (col.tallone === '#F4F1EA' || col.tallone === '#FFFFFF' || col.tallone === '#D9B44A' || col.tallone === '#E8A5B5' ? '#111' : '#F4F1EA') + '">' + c.ini + '</text>' : '') +
      '<path d="M150 68 Q200 56 250 74" fill="none" stroke="#111" stroke-width="1" stroke-dasharray="3 3" opacity=".5"/>' + lacci +
      '<path d="M30 ' + sy + ' L340 ' + sy + ' L340 ' + (sy + 8) + ' Q342 170 320 172 L50 172 Q28 170 30 ' + (sy + 8) + ' Z" fill="' + col.suola + '" stroke="#111" stroke-width="1.5"/>' +
      (run ? '<path d="M40 152 Q120 144 200 154 T336 150" fill="none" stroke="#111" stroke-width="1.2" opacity=".5"/>' : '<path d="M34 160h302" stroke="#111" stroke-width=".8" opacity=".35"/>') + '</svg>';
  }
  function home() {
    $('#h-come').innerHTML = [['Scegli il modello', 'Basso, alto o runner.'], ['Colora ogni parte', 'Tomaia, punta, tallone, lacci e suola, anche tutti diversi.'], ['Aggiungi le iniziali', 'Stampate a caldo sul tallone.'], ['La cuciamo in 10 giorni', 'In laboratorio, qui dietro al negozio.']].map(function (x, i) { return '<li><span>0' + (i + 1) + '</span><span><b>' + x[0] + '</b><small>' + x[1] + '</small></span></li>'; }).join('');
  }
  function modelli() {
    $('#mo-lista').innerHTML = MOD.map(function (m) { var c = JSON.parse(JSON.stringify(conf)); c.mod = m.id; c.ini = ''; return '<li><a href="#/crea/' + m.id + '">' + scarpa(c, 'lato', true) + '<span><b>' + m.n + '</b><small>' + m.d + '</small><span class="pr">da ' + m.p + ' €</span></span></a></li>'; }).join('');
  }
  function crea(id) {
    if (id && mod(id)) { conf.mod = id; salvaConf(); }
    $('#cr-ini').value = conf.ini;
    disegna();
  }
  function disegna() {
    var m = mod(conf.mod), mt = matr(conf.mat);
    $('#cr-ant').innerHTML = scarpa(conf, vista) + '<p class="info"><span>' + m.n + ' · ' + mt[1].toLowerCase() + '</span><b>' + prezzo(conf) + ' €</b></p>';
    $$('[data-vista]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.vista === vista); });
    $('#cr-mod').innerHTML = MOD.map(function (x) { return '<button type="button" data-mod="' + x.id + '" aria-pressed="' + (x.id === conf.mod) + '">' + x.n + '</button>'; }).join('');
    $('#cr-parti').innerHTML = PARTI.map(function (p) { return '<button type="button" data-parte="' + p[0] + '" aria-pressed="' + (p[0] === parte) + '"><i style="background:' + conf.col[p[0]] + '"></i>' + p[1] + '</button>'; }).join('');
    $('#cr-col').innerHTML = COL.map(function (c) { return '<button type="button" data-col="' + c[0] + '" aria-pressed="' + (conf.col[parte] === c[0]) + '" aria-label="' + c[1] + '" title="' + c[1] + '" style="background:' + c[0] + '"></button>'; }).join('');
    $('#cr-mat').innerHTML = MAT.map(function (x) { return '<button type="button" data-mat="' + x[0] + '" aria-pressed="' + (x[0] === conf.mat) + '">' + x[1] + '<small>' + (x[2] > 0 ? '+' + x[2] + ' €' : x[2] < 0 ? x[2] + ' €' : 'compreso') + '</small></button>'; }).join('');
    $('#cr-tg').innerHTML = TG.map(function (t) { var no = conf.mod === 'alto' && t === 36; return '<button type="button" data-tg="' + t + '" aria-pressed="' + (conf.tg === t) + '"' + (no ? ' disabled aria-label="' + t + ', non disponibile per questo modello"' : '') + '>' + t + '</button>'; }).join('');
    $('#cr-tot').innerHTML = '<p><span>Modello ' + m.n.toLowerCase() + '</span><span>' + m.p + ' €</span></p>' + (mt[2] ? '<p><span>' + mt[1] + '</span><span>' + (mt[2] > 0 ? '+' : '') + mt[2] + ' €</span></p>' : '') + (conf.ini ? '<p><span>Iniziali ' + conf.ini + '</span><span>+10 €</span></p>' : '') + '<p class="t"><span>Totale</span><span>' + prezzo(conf) + ' €</span></p><button class="btn" type="button" id="cr-add">Metti nella borsa</button><p class="err" id="cr-err" role="alert" style="color:#FF8A70"></p>';
  }
  function borsa() {
    var box = $('#bo-box');
    if (st.ord) { box.innerHTML = '<div class="ok"><h2>Ordine ricevuto.</h2><p>Codice ordine</p><span class="cod">' + st.ord.cod + '</span><p>' + st.ord.n + (st.ord.n === 1 ? ' paio' : ' paia') + ', totale ' + st.ord.tot + ' €.</p><ol><li>Oggi controlliamo i colori e ti scriviamo se manca qualcosa.</li><li>Tra 2 giorni tagliamo la pelle.</li><li>Entro 10 giorni lavorativi ' + (st.ord.sped === 'casa' ? 'parte il pacco.' : 'la trovi in negozio.') + '</li></ol><button class="btn full" type="button" id="bo-nuovo">Crea un altro paio</button></div>'; return; }
    if (!st.borsa.length) { box.innerHTML = '<p class="vuoto">La borsa è vuota.</p><a class="btn full" href="#/crea">Crea la tua sneaker</a>'; return; }
    var tot = st.borsa.reduce(function (s, x) { return s + prezzo(x); }, 0), sped = st.sped === 'casa' ? (tot >= 150 ? 0 : 8) : 0;
    box.innerHTML = st.borsa.map(function (x, i) { return '<div class="riga">' + scarpa(x, 'lato', true) + '<div><b>' + mod(x.mod).n + ' · taglia ' + x.tg + '</b><small>Tomaia ' + nomeCol(x.col.tomaia) + ' in ' + matr(x.mat)[1].toLowerCase() + ', tallone ' + nomeCol(x.col.tallone) + ', suola ' + nomeCol(x.col.suola) + (x.ini ? ', iniziali ' + x.ini : '') + '</small><b>' + prezzo(x) + ' €</b><button type="button" data-togli="' + i + '">Togli</button></div></div>'; }).join('') +
      '<p class="f-lab">Consegna</p><div class="seg" role="group" aria-label="Consegna"><button type="button" data-sped="casa" aria-pressed="' + (st.sped === 'casa') + '">A casa<small>' + (tot >= 150 ? 'gratis' : '8 €, gratis da 150 €') + '</small></button><button type="button" data-sped="negozio" aria-pressed="' + (st.sped === 'negozio') + '">Ritiro in negozio<small>gratis, con prova</small></button></div>' +
      '<p class="consegna">Ogni paio è cucito per te: pronto in 10 giorni lavorativi. Se la taglia non va, la rifacciamo una volta senza costi.</p>' +
      '<div class="tot"><p><span>Sneakers</span><span>' + tot + ' €</span></p><p><span>Consegna</span><span>' + (sped ? sped + ' €' : 'gratis') + '</span></p><p class="t"><span>Totale</span><span>' + (tot + sped) + ' €</span></p><button class="btn" type="button" id="bo-ok">Ordina (demo)</button></div><p class="nota">Demo: nessun pagamento e nessun dato inviato.</p>';
  }
  var R = { home: home, modelli: modelli, crea: crea, borsa: borsa };
  function route() {
    var p = location.hash.replace(/^#\/?/, '').split('/'), n = R[p[0]] ? p[0] : 'home';
    $$('[data-screen]').forEach(function (s) { s.hidden = s.dataset.screen !== n; });
    $$('.tabbar a').forEach(function (a) { if (a.dataset.tab === n) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    R[n](p[1]); window.scrollTo(0, 0); var sc = $('.app > main'); if (sc) sc.scrollTop = 0;
  }
  var tieni = function (fn) { var sc = $('.app > main'), y = sc ? sc.scrollTop : 0, wy = window.scrollY; fn(); if (sc) sc.scrollTop = y; window.scrollTo(0, wy); };
  document.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b || b.disabled) return;
    if (b.dataset.vista) { vista = b.dataset.vista; tieni(disegna); }
    else if (b.dataset.mod) { conf.mod = b.dataset.mod; if (conf.mod === 'alto' && conf.tg === 36) conf.tg = null; salvaConf(); tieni(disegna); }
    else if (b.dataset.parte) { parte = b.dataset.parte; tieni(disegna); }
    else if (b.dataset.col) { conf.col[parte] = b.dataset.col; salvaConf(); tieni(disegna); }
    else if (b.dataset.mat) { conf.mat = b.dataset.mat; salvaConf(); tieni(disegna); }
    else if (b.dataset.tg) { conf.tg = +b.dataset.tg; salvaConf(); tieni(disegna); }
    else if (b.id === 'cr-add') { if (!conf.tg) { $('#cr-err').textContent = 'Scegli la taglia qui sopra.'; return; } st.borsa.push(JSON.parse(JSON.stringify(conf))); st.ord = null; salva(); location.hash = '#/borsa'; }
    else if (b.dataset.togli) { st.borsa.splice(+b.dataset.togli, 1); salva(); borsa(); }
    else if (b.dataset.sped) { st.sped = b.dataset.sped; salva(); tieni(borsa); }
    else if (b.id === 'bo-ok') { var tot = st.borsa.reduce(function (s, x) { return s + prezzo(x); }, 0), sp = st.sped === 'casa' && tot < 150 ? 8 : 0; st.ord = { cod: 'PS-' + (1000 + tot * 7 % 9000), n: st.borsa.length, tot: tot + sp, sped: st.sped }; st.borsa = []; salva(); borsa(); }
    else if (b.id === 'bo-nuovo') { st.ord = null; salva(); location.hash = '#/crea'; }
  });
  $('#cr-ini').addEventListener('input', function () { var v = this.value.toUpperCase().replace(/[^A-ZÀ-Ù]/g, '').slice(0, 3); if (this.value !== v) this.value = v; conf.ini = v; salvaConf(); $('#cr-ant').innerHTML = scarpa(conf, vista) + '<p class="info"><span>' + mod(conf.mod).n + ' · ' + matr(conf.mat)[1].toLowerCase() + '</span><b>' + prezzo(conf) + ' €</b></p>'; var t = $('#cr-tot'); if (t) { var y = $('.app > main') ? $('.app > main').scrollTop : 0; disegna(); if ($('.app > main')) $('.app > main').scrollTop = y; } });
  window.addEventListener('hashchange', route);
  salva(); route();
})();
