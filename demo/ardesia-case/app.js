/* Ardesia Case - app dimostrativa. Nessun dato viene inviato: preferiti e visite restano nel browser. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var mem = {
    get: function (k, d) { try { var v = localStorage.getItem('ardesia-' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('ardesia-' + k, JSON.stringify(v)); } catch (e) {} }
  };
  var IMM = [
    { id: 'a12', con: 'vendita', z: 'Centro storico', n: 'Trilocale con parquet in via dei Tessitori', p: 238000, mq: 92, loc: 3, bagni: 1, piano: '2° con ascensore', cl: 'C', anno: 1962, img: 'img/soggiorno.webp', alt: 'Soggiorno con parquet a spina di pesce e grande finestra', x: 168, y: 92, nuovo: 1, desc: 'Ristrutturato nel 2023: impianto elettrico nuovo, infissi doppi, parquet originale recuperato. Soggiorno con due finestre sulla via, cucina abitabile, due camere.', vic: [['Scuola primaria', '4 min a piedi'], ['Fermata bus 3', '2 min a piedi'], ['Mercato coperto', '6 min a piedi'], ['Stazione', '12 min a piedi']] },
    { id: 'b07', con: 'vendita', z: 'Campagna', n: 'Casa in pietra con giardino a Poggio Sereno', p: 345000, mq: 160, loc: 5, bagni: 2, piano: 'Indipendente su 2 livelli', cl: 'E', anno: 1930, img: 'img/casa.webp', alt: 'Casa in pietra con giardino verde e cancello in legno', x: 300, y: 150, nuovo: 1, desc: 'Casa indipendente con 1.200 mq di giardino, forno a legna e magazzino. Tetto rifatto, da sistemare bagni e caldaia: lo trovi scritto nella scheda tecnica.', vic: [['Paese più vicino', '5 min in auto'], ['Scuolabus', 'passa davanti'], ['Superstrada', '9 min in auto'], ['Farmacia', '6 min in auto']] },
    { id: 'c03', con: 'vendita', z: 'Colle Alto', n: 'Attico con terrazzo e cucina a isola', p: 415000, mq: 118, loc: 4, bagni: 2, piano: '5° e ultimo, ascensore', cl: 'A2', anno: 2019, img: 'img/cucina.webp', alt: 'Cucina moderna con isola che si apre su un terrazzo con vista sui tetti', x: 82, y: 54, desc: 'Terrazzo di 40 mq sui tetti, cucina a isola aperta sul soggiorno, riscaldamento a pavimento e pannelli solari condominiali. Box auto incluso.', vic: [['Parco del Colle', '3 min a piedi'], ['Scuola media', '8 min a piedi'], ['Fermata bus 7', '1 min a piedi'], ['Ospedale', '10 min in auto']] },
    { id: 'd21', con: 'vendita', z: 'Borgo Fiume', n: 'Bilocale vicino al lungofiume', p: 129000, mq: 55, loc: 2, bagni: 1, piano: '1° senza ascensore', cl: 'D', anno: 1975, x: 210, y: 170, desc: 'Ideale come prima casa o da mettere a reddito. Cantina e posto bici in cortile.', vic: [['Lungofiume', '1 min a piedi'], ['Università', '9 min in bici'], ['Supermercato', '3 min a piedi'], ['Fermata bus 3', '4 min a piedi']] },
    { id: 'e15', con: 'affitto', z: 'Centro storico', n: 'Monolocale arredato in vicolo San Biagio', p: 620, mq: 34, loc: 1, bagni: 1, piano: 'Piano terra rialzato', cl: 'F', anno: 1910, x: 140, y: 110, nuovo: 1, desc: 'Arredato, spese condominiali comprese. Contratto 4+4, si chiedono due mensilità di deposito.', vic: [['Piazza grande', '2 min a piedi'], ['Fermata bus 1', '3 min a piedi'], ['Palestra', '5 min a piedi'], ['Stazione', '10 min a piedi']] },
    { id: 'f09', con: 'affitto', z: 'Borgo Fiume', n: 'Trilocale con balcone e posto auto', p: 850, mq: 80, loc: 3, bagni: 1, piano: '3° con ascensore', cl: 'C', anno: 1988, x: 236, y: 150, desc: 'Non arredato, cucina a vista, due camere, balcone verso il fiume. Disponibile dal mese prossimo.', vic: [['Asilo nido', '5 min a piedi'], ['Supermercato', '2 min a piedi'], ['Fermata bus 3', '3 min a piedi'], ['Parco fluviale', '4 min a piedi']] },
    { id: 'g30', con: 'vendita', z: 'Colle Alto', n: 'Quadrilocale con giardino condominiale', p: 289000, mq: 125, loc: 4, bagni: 2, piano: '1° con ascensore', cl: 'B', anno: 2008, x: 60, y: 90, desc: 'Tre camere, doppi servizi, cantina e garage. Giardino condominiale curato con giochi.', vic: [['Scuola primaria', '6 min a piedi'], ['Parco del Colle', '5 min a piedi'], ['Fermata bus 7', '3 min a piedi'], ['Centro', '12 min in bus']] }
  ];
  var CUORE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>';
  var st = mem.get('stato', { pref: ['c03'], vis: [], ric: null });
  var filtro = { con: 'vendita', zona: 'tutte', max: 0, loc: 1 };
  var ord = 'nuovi';
  var visSel = { id: 'a12', g: 1, ora: null, tipo: 'presenza' };
  var GG = ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'];
  var MM = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];
  var ORE = ['9:30', '10:30', '11:30', '12:30', '15:00', '16:00', '17:00', '18:00'];
  var byId = function (id) { return IMM.filter(function (i) { return i.id === id; })[0]; };
  var euro = function (n) { return n.toLocaleString('it-IT') + ' €'; };
  var prezzo = function (i) { return i.con === 'affitto' ? euro(i.p) + '<small> al mese</small>' : euro(i.p); };
  var giorno = function (k) { var d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + k); return d; };
  var salva = function () { mem.set('stato', st); $('#n-pref').textContent = st.pref.length; };

  /* disegni al posto delle foto: facciata e planimetria, sempre diversi per immobile */
  function facciata(i) {
    var piani = Math.min(5, Math.max(1, i.loc)), w = '';
    for (var r = 0; r < piani; r++) for (var c = 0; c < 4; c++) w += '<rect x="' + (112 + c * 26) + '" y="' + (150 - (r + 1) * 22) + '" width="14" height="14" fill="#F4F1EC" opacity="' + (0.6 + ((r + c + i.mq) % 3) * 0.15) + '"/>';
    return '<svg class="ill" viewBox="0 0 320 180" role="img" aria-label="Disegno della facciata"><rect width="320" height="180" fill="#E7E2D9"/><rect x="100" y="' + (150 - piani * 22 - 10) + '" width="120" height="' + (piani * 22 + 10) + '" fill="#3E5566"/>' + w + '<rect x="150" y="136" width="20" height="14" fill="#B5523B"/><rect y="150" width="320" height="30" fill="#CFC6B8"/></svg>';
  }
  function pianta(i) {
    var s = '<svg class="ill" viewBox="0 0 320 240" role="img" aria-label="Planimetria con ' + i.loc + ' locali"><rect width="320" height="240" fill="#FFFFFF"/><g fill="none" stroke="#1F2A33" stroke-width="4"><rect x="30" y="24" width="260" height="192"/>';
    if (i.loc >= 2) s += '<path d="M170 24v120M30 144h140"/>';
    if (i.loc >= 3) s += '<path d="M170 100h120"/>';
    if (i.loc >= 4) s += '<path d="M230 100v116"/>';
    s += '</g><g font-family="Manrope, sans-serif" font-size="12" fill="#5D6870"><text x="48" y="80">Soggiorno</text>' + (i.loc >= 2 ? '<text x="190" y="66">Camera</text>' : '') + (i.loc >= 3 ? '<text x="182" y="160">Camera</text>' : '') + '<text x="48" y="186">' + (i.bagni > 1 ? 'Cucina e bagni' : 'Cucina e bagno') + '</text></g><text x="290" y="236" text-anchor="end" font-family="Manrope, sans-serif" font-size="11" fill="#B5523B">' + i.mq + ' mq · disegno indicativo</text></svg>';
    return s;
  }
  function mappa(i) {
    return '<svg viewBox="0 0 360 210" role="img" aria-label="Mappa stilizzata della zona ' + i.z + '"><rect width="360" height="210" fill="#ECE7DE"/><path d="M0 178C80 160 150 196 230 172s100-20 130-12v50H0z" fill="#BFD3DC"/><g stroke="#FFFFFF" stroke-width="9" fill="none"><path d="M0 70h360M120 0v210M0 130c90-8 180 6 360-12M250 0l-40 210"/></g><g stroke="#FFFFFF" stroke-width="4" fill="none"><path d="M40 0v150M190 0v210M0 30h360M300 0v170"/></g><rect x="20" y="86" width="80" height="34" rx="3" fill="#C9D8BF"/><text x="28" y="107" font-family="Manrope, sans-serif" font-size="11" fill="#4F7A5A">Parco</text><text x="250" y="196" font-family="Manrope, sans-serif" font-size="11" fill="#3E5566">Fiume</text><circle cx="' + i.x + '" cy="' + i.y + '" r="26" fill="#B5523B" opacity=".18"/><path d="M' + i.x + ' ' + (i.y + 14) + 'c-10-12-14-18-14-24a14 14 0 0 1 28 0c0 6-4 12-14 24z" fill="#B5523B"/><circle cx="' + i.x + '" cy="' + (i.y - 10) + '" r="5" fill="#fff"/></svg>';
  }
  function card(i) {
    var f = st.pref.indexOf(i.id) >= 0;
    return '<li class="card"><a href="#/immobile/' + i.id + '">' + (i.img ? '<img class="ph" src="' + i.img + '" alt="' + i.alt + '" width="640" height="360" loading="lazy">' : facciata(i)) +
      '<div class="tx"><div class="prezzo">' + prezzo(i) + '</div><h3>' + i.n + '</h3><div class="dati"><span>' + i.mq + ' mq</span><span>' + i.loc + (i.loc === 1 ? ' locale' : ' locali') + '</span><span>' + i.z + '</span></div></div></a>' +
      (i.nuovo ? '<span class="badge">Nuovo</span>' : '') + '<button class="cuore" type="button" data-pref="' + i.id + '" aria-pressed="' + f + '" aria-label="' + (f ? 'Togli dai salvati' : 'Salva') + '">' + CUORE + '</button></li>';
  }
  function risultati() {
    var l = IMM.filter(function (i) { return i.con === filtro.con && (filtro.zona === 'tutte' || i.z === filtro.zona) && (!filtro.max || i.p <= filtro.max) && i.loc >= filtro.loc; });
    if (ord === 'prezzo') l.sort(function (a, b) { return a.p - b.p; });
    else if (ord === 'mq') l.sort(function (a, b) { return b.mq - a.mq; });
    else l.sort(function (a, b) { return (b.nuovo || 0) - (a.nuovo || 0); });
    return l;
  }
  function maxOpts() {
    var o = filtro.con === 'affitto' ? [0, 600, 800, 1000] : [0, 150000, 250000, 350000, 450000];
    $('#c-max').innerHTML = o.map(function (v) { return '<option value="' + v + '"' + (v === filtro.max ? ' selected' : '') + '>' + (v ? 'Fino a ' + euro(v) : 'Nessun limite') + '</option>'; }).join('');
  }
  function home() {
    $$('[data-con]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.con === filtro.con); });
    $$('[data-loc]').forEach(function (b) { b.setAttribute('aria-pressed', +b.dataset.loc === filtro.loc); });
    $('#c-zona').value = filtro.zona; maxOpts();
    $('#c-vai').textContent = 'Vedi ' + risultati().length + ' immobili';
    $('#home-nuovi').innerHTML = IMM.filter(function (i) { return i.nuovo; }).slice(0, 2).map(card).join('');
  }
  function annunci() {
    var ch = [['con', filtro.con === 'vendita' ? 'In vendita' : 'In affitto'], ['zona', filtro.zona === 'tutte' ? 'Tutte le zone' : filtro.zona], ['max', filtro.max ? 'Fino a ' + euro(filtro.max) : 'Qualsiasi prezzo'], ['loc', filtro.loc > 1 ? 'Da ' + filtro.loc + ' locali' : 'Tutti i locali']];
    $('#chips').innerHTML = ch.map(function (c) { return '<button type="button" data-chip="' + c[0] + '" aria-pressed="' + ((c[0] === 'con') || (c[0] === 'zona' && filtro.zona !== 'tutte') || (c[0] === 'max' && !!filtro.max) || (c[0] === 'loc' && filtro.loc > 1)) + '">' + c[1] + (c[0] !== 'con' && ((c[0] === 'zona' && filtro.zona !== 'tutte') || (c[0] === 'max' && filtro.max) || (c[0] === 'loc' && filtro.loc > 1)) ? ' ×' : '') + '</button>'; }).join('');
    var l = risultati();
    $('#an-ord').value = ord;
    $('#an-conta').textContent = l.length + (l.length === 1 ? ' immobile trovato' : ' immobili trovati');
    $('#an-lista').innerHTML = l.length ? l.map(card).join('') : '<li class="vuoto">Nessun immobile con questi filtri. Togli un filtro qui sopra.</li>';
  }
  function immobile(id) {
    var i = byId(id) || IMM[0], f = st.pref.indexOf(i.id) >= 0;
    var sl = (i.img ? ['<img src="' + i.img + '" alt="' + i.alt + '" width="1200" height="900">'] : [facciata(i)]).concat([pianta(i), mappa(i)]);
    $('#i-box').innerHTML = '<div class="gal"><div class="gal-track" id="gal">' + sl.join('') + '</div><span class="cnt" id="gal-cnt">1 / ' + sl.length + '</span></div><div class="gal-dots" role="group" aria-label="Scegli immagine">' + sl.map(function (s, k) { return '<button type="button" data-sl="' + k + '" aria-label="Immagine ' + (k + 1) + '"' + (k === 0 ? ' aria-current="true"' : '') + '></button>'; }).join('') + '</div>' +
      '<h1 id="i-nome">' + i.n + '</h1><div class="i-prezzo"><b>' + prezzo(i) + '</b><small>Rif. ' + i.id.toUpperCase() + ' · ' + i.z + '</small></div>' +
      '<div class="dati-g"><div><b>' + i.mq + '</b><small>mq</small></div><div><b>' + i.loc + '</b><small>locali</small></div><div><b>' + i.bagni + '</b><small>bagni</small></div><div><b>' + i.cl + '</b><small>classe</small></div></div>' +
      '<p>' + i.desc + '</p><ul class="lista-k"><li><span>Piano</span><span>' + i.piano + '</span></li><li><span>Anno</span><span>' + i.anno + '</span></li><li><span>Contratto</span><span>' + (i.con === 'vendita' ? 'Vendita' : 'Affitto 4+4') + '</span></li></ul>' +
      '<h2 class="sec">La zona</h2><div class="mappa">' + mappa(i) + '<p>La posizione è indicativa: l\'indirizzo preciso lo diamo alla visita.</p></div><ul class="vicino">' + i.vic.map(function (v) { return '<li><b>' + v[0] + '</b>' + v[1] + '</li>'; }).join('') + '</ul>' +
      '<div class="agente"><span class="av" aria-hidden="true">GL</span><span><b>Giulia L.</b><small>Segue questo immobile, risponde entro la giornata</small></span></div>' +
      '<div class="azioni"><a class="btn" href="#/visita/' + i.id + '">Prenota una visita</a><button class="btn chiaro" type="button" data-pref="' + i.id + '" aria-pressed="' + f + '">' + (f ? 'Salvato' : 'Salva') + '</button></div>';
    var tr = $('#gal');
    tr.addEventListener('scroll', function () { var k = Math.round(tr.scrollLeft / tr.clientWidth); $('#gal-cnt').textContent = (k + 1) + ' / ' + sl.length; $$('[data-sl]').forEach(function (b) { if (+b.dataset.sl === k) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); }); }, { passive: true });
  }
  function visita(id) {
    if (id && byId(id)) { visSel.id = id; visSel.ora = null; }
    var i = byId(visSel.id);
    $('#f-vi').hidden = false; $('#vi-ok').hidden = true;
    $('#vi-imm').innerHTML = (i.img ? '<img src="' + i.img + '" alt="" width="152" height="116">' : facciata(i)) + '<span><b>' + i.n + '</b><small>' + i.z + ' · ' + (i.con === 'vendita' ? euro(i.p) : euro(i.p) + ' al mese') + '</small></span>';
    disegnaVisita();
  }
  function disegnaVisita() {
    var g = '';
    for (var k = 1; k <= 10; k++) { var d = giorno(k), chiuso = d.getDay() === 0; g += '<button type="button" data-g="' + k + '" aria-pressed="' + (k === visSel.g) + '"' + (chiuso ? ' disabled aria-label="domenica, agenzia chiusa"' : '') + '><small>' + (k === 1 ? 'domani' : GG[d.getDay()]) + '</small><b>' + d.getDate() + '</b></button>'; }
    $('#vi-giorni').innerHTML = g;
    if (giorno(visSel.g).getDay() === 0) { visSel.g++; return disegnaVisita(); }
    var sab = giorno(visSel.g).getDay() === 6;
    $('#vi-orari').innerHTML = ORE.map(function (o, k) { var occ = (sab && k > 3) || ((giorno(visSel.g).getDate() + k * 3) % 4 === 0); if (occ && visSel.ora === o) visSel.ora = null; return '<button type="button" data-ora="' + o + '" aria-pressed="' + (visSel.ora === o) + '"' + (occ ? ' disabled aria-label="' + o + ', occupato"' : '') + '>' + o + '</button>'; }).join('');
    $$('[data-tipo]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.tipo === visSel.tipo); });
  }
  function preferiti() {
    var l = IMM.filter(function (i) { return st.pref.indexOf(i.id) >= 0; });
    $('#pr-lista').innerHTML = l.length ? l.map(card).join('') : '<li class="vuoto">Tocca il cuore su un immobile per ritrovarlo qui.</li>';
    $('#pr-ric').textContent = st.ric ? 'Ti avvisiamo per: ' + st.ric : 'Nessuna ricerca salvata. Ti scriviamo solo quando entra un immobile adatto.';
    $('#pr-vis').innerHTML = st.vis.length ? st.vis.map(function (v, k) { return '<li><span class="d"><small>' + v.gs + '</small><b>' + v.gn + '</b></span><span class="info"><b>' + v.n + '</b><small>alle ' + v.ora + ' · ' + (v.tipo === 'video' ? 'videochiamata' : 'di persona') + '</small></span><button type="button" data-annulla="' + k + '">Annulla</button></li>'; }).join('') : '<li class="vuoto">Nessuna visita prenotata.</li>';
  }
  var R = { home: home, annunci: annunci, immobile: immobile, visita: visita, preferiti: preferiti };
  function route() {
    var p = location.hash.replace(/^#\/?/, '').split('/'), n = R[p[0]] ? p[0] : 'home';
    $$('[data-screen]').forEach(function (s) { s.hidden = s.dataset.screen !== n; });
    var tab = n === 'immobile' ? 'annunci' : n;
    $$('.tabbar a').forEach(function (a) { if (a.dataset.tab === tab) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    R[n](p[1]); window.scrollTo(0, 0); var sc = $('.app > main'); if (sc) sc.scrollTop = 0;
  }
  function ridisegna() { var n = location.hash.replace(/^#\/?/, '').split('/')[0]; if (n === 'annunci') annunci(); else if (n === 'preferiti') preferiti(); else if (n === 'home' || !n) home(); }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.dataset.pref) {
      var k = st.pref.indexOf(b.dataset.pref); if (k >= 0) st.pref.splice(k, 1); else st.pref.push(b.dataset.pref); salva();
      if (location.hash.indexOf('immobile') >= 0) { var on = st.pref.indexOf(b.dataset.pref) >= 0; $$('[data-pref="' + b.dataset.pref + '"]').forEach(function (x) { x.setAttribute('aria-pressed', on); if (!x.classList.contains('cuore')) x.textContent = on ? 'Salvato' : 'Salva'; }); } else ridisegna();
    } else if (b.dataset.con) { filtro.con = b.dataset.con; filtro.max = 0; home(); }
    else if (b.dataset.loc) { filtro.loc = +b.dataset.loc; home(); }
    else if (b.dataset.chip) { var c = b.dataset.chip; if (c === 'con') filtro.con = filtro.con === 'vendita' ? 'affitto' : 'vendita', filtro.max = 0; else if (c === 'zona') filtro.zona = 'tutte'; else if (c === 'max') filtro.max = 0; else filtro.loc = 1; annunci(); }
    else if (b.dataset.sl) { var t = $('#gal'); t.scrollTo({ left: t.clientWidth * +b.dataset.sl, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); }
    else if (b.dataset.g) { visSel.g = +b.dataset.g; visSel.ora = null; disegnaVisita(); }
    else if (b.dataset.ora) { visSel.ora = b.dataset.ora; $('#vi-err').textContent = ''; disegnaVisita(); }
    else if (b.dataset.tipo) { visSel.tipo = b.dataset.tipo; disegnaVisita(); }
    else if (b.dataset.annulla) { st.vis.splice(+b.dataset.annulla, 1); salva(); preferiti(); }
    else if (b.id === 'pr-salva') { st.ric = (filtro.con === 'vendita' ? 'vendita' : 'affitto') + ', ' + (filtro.zona === 'tutte' ? 'tutte le zone' : filtro.zona) + (filtro.max ? ', fino a ' + euro(filtro.max) : '') + ', da ' + filtro.loc + ' locali'; salva(); preferiti(); }
  });
  $('#c-zona').addEventListener('change', function () { filtro.zona = this.value; home(); });
  $('#c-max').addEventListener('change', function () { filtro.max = +this.value; home(); });
  $('#an-ord').addEventListener('change', function () { ord = this.value; annunci(); });
  $('#f-cerca').addEventListener('submit', function (e) { e.preventDefault(); location.hash = '#/annunci'; });
  $('#f-vi').addEventListener('submit', function (e) {
    e.preventDefault();
    var nome = $('#vi-nome').value.trim();
    if (!visSel.ora) { $('#vi-err').textContent = 'Scegli un orario libero.'; return; }
    if (nome.length < 2) { $('#vi-err').textContent = 'Scrivi il tuo nome, così l\'agente sa chi aspettare.'; $('#vi-nome').focus(); return; }
    var i = byId(visSel.id), d = giorno(visSel.g);
    st.vis.unshift({ n: i.n, gs: GG[d.getDay()], gn: d.getDate(), ora: visSel.ora, tipo: visSel.tipo }); salva();
    $('#f-vi').hidden = true; var ok = $('#vi-ok'); ok.hidden = false;
    ok.innerHTML = '<h2>Visita fissata, ' + nome.split(' ')[0] + '.</h2><p>' + GG[d.getDay()] + ' ' + d.getDate() + ' ' + MM[d.getMonth()] + ' alle ' + visSel.ora + (visSel.tipo === 'video' ? ', in videochiamata.' : ', ci vediamo davanti al portone.') + '</p><p>Ti accompagna Giulia. Porta un documento se vuoi fare una proposta.</p><a class="btn" href="#/preferiti">Vedi le mie visite</a>';
    visSel.ora = null; $('#vi-nome').value = '';
  });
  window.addEventListener('hashchange', route);
  salva(); route();
})();
