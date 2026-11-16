/* Salvia - app dimostrativa. Nessun dato viene inviato: gli appuntamenti restano nel browser. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var mem = {
    get: function (k, d) { try { var v = localStorage.getItem('salvia-' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('salvia-' + k, JSON.stringify(v)); } catch (e) {} }
  };
  var FOGLIA = '<svg viewBox="0 0 48 48"><path d="M24 44C12 32 12 16 24 4c12 12 12 28 0 40zM24 12v32" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
  var CAT = [['tutti', 'Tutti'], ['viso', 'Viso'], ['corpo', 'Corpo'], ['mani', 'Mani e piedi'], ['rituali', 'Rituali']];
  var TR = [
    { id: 'pulizia', c: 'viso', n: 'Pulizia del viso profonda', d: 'Vapore, estrazione delicata, maschera e massaggio.', min: 60, p: 55, top: 1, fasi: ['Analisi della pelle con la lente', 'Detersione e vapore tiepido', 'Pulizia dei pori', 'Maschera scelta per la tua pelle', 'Massaggio finale e crema'], ok: 'Pelli miste e grasse, una volta al mese. Sconsigliata nei giorni dopo il sole forte.' },
    { id: 'idra', c: 'viso', n: 'Trattamento idratante', d: 'Per la pelle che tira: siero, maschera all\'acido ialuronico, massaggio.', min: 50, p: 60, fasi: ['Detersione', 'Esfoliazione leggera', 'Siero e maschera idratante', 'Massaggio viso e collo'], ok: 'Pelli secche o stanche, anche in inverno.' },
    { id: 'pietre', c: 'corpo', n: 'Massaggio con pietre calde', d: 'Pietre di basalto e olio caldo su schiena, gambe e piedi.', min: 75, p: 85, img: 'img/pietre.webp', top: 1, fasi: ['Due parole su come stai', 'Olio caldo e pietre lungo la schiena', 'Gambe e piedi', 'Dieci minuti di riposo con una tisana'], ok: 'Tensioni e stanchezza. Da evitare in gravidanza.' },
    { id: 'drenante', c: 'corpo', n: 'Massaggio drenante', d: 'Manualità lente per gambe leggere.', min: 50, p: 60, fasi: ['Spazzolatura a secco', 'Massaggio dal piede in su', 'Crema fresca alle gambe'], ok: 'Ritenzione di liquidi e gambe pesanti.' },
    { id: 'presso', c: 'corpo', n: 'Pressoterapia', d: 'Gambali a pressione per la circolazione.', min: 40, p: 35, fasi: ['Misura delle gambe', 'Seduta con i gambali', 'Crema drenante'], ok: 'Meglio in carnet da 10 sedute. Non adatta con problemi di circolazione: chiedici prima.' },
    { id: 'semi', c: 'mani', n: 'Manicure con semipermanente', d: 'Cuticole, limatura e colore che dura tre settimane.', min: 60, p: 35, img: 'img/manicure.webp', top: 1, fasi: ['Rimozione del colore precedente', 'Cuticole e forma', 'Base, colore e lucido', 'Olio per le cuticole'], ok: 'Scegli il colore in cabina: abbiamo più di cento tinte.' },
    { id: 'pedi', c: 'mani', n: 'Pedicure estetica', d: 'Pediluvio, cuticole, levigatura e smalto.', min: 50, p: 40, fasi: ['Pediluvio con sali', 'Cuticole e unghie', 'Levigatura del tallone', 'Crema e smalto'], ok: 'Per problemi alle unghie serve il podologo, te lo indichiamo noi.' },
    { id: 'rituale', c: 'rituali', n: 'Rituale Salvia', d: 'Scrub al sale, massaggio rilassante e trattamento viso breve.', min: 110, p: 120, img: 'img/cabina.webp', top: 1, fasi: ['Tisana di benvenuto', 'Scrub al sale e oli', 'Massaggio rilassante di 50 minuti', 'Viso express', 'Riposo nella sala relax'], ok: 'Il regalo più scelto per compleanni e anniversari.' }
  ];
  var OP = [['chiunque', 'Prima libera'], ['marta', 'Marta'], ['elisa', 'Elisa']];
  var ORARI = ['9:00', '10:00', '11:00', '12:00', '14:30', '15:30', '16:30', '17:30', '18:30'];
  var st = mem.get('stato', { appt: [] });
  var sel = { tr: 'pietre', op: 'chiunque', g: 1, ora: null };
  var filtro = 'tutti';
  var byId = function (id) { return TR.filter(function (t) { return t.id === id; })[0]; };
  var dur = function (m) { return m >= 60 ? Math.floor(m / 60) + ' h' + (m % 60 ? ' ' + m % 60 + ' min' : '') : m + ' min'; };
  var giorno = function (k) { var d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + k); return d; };
  var GG = ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'];
  var MM = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];
  /* orari occupati: sempre uguali per lo stesso giorno, cosi la demo e' coerente */
  var occupato = function (k, i, op) { var d = giorno(k).getDate(); return ((d * 7 + i * 3 + (op === 'elisa' ? 2 : op === 'marta' ? 1 : 0)) % 5) < 2; };
  var riga = function (t) { return '<li><a href="#/trattamento/' + t.id + '"><span><b>' + t.n + '</b><small>' + dur(t.min) + '</small></span><span class="pr">' + t.p + ' €</span></a></li>'; };

  function home() {
    var a = st.appt[0];
    $('#home-appt').innerHTML = a ? '<a href="#/agenda"><span class="d"><small>' + a.gs + '</small><b>' + a.gn + '</b></span><span><b>' + a.n + '</b><small>alle ' + a.ora + ' con ' + a.op + '</small></span></a>' : '';
    $('#home-top').innerHTML = TR.filter(function (t) { return t.top; }).map(riga).join('');
  }
  function trattamenti() {
    $('#filtri').innerHTML = CAT.map(function (c) { return '<button type="button" data-f="' + c[0] + '" aria-pressed="' + (c[0] === filtro) + '">' + c[1] + '</button>'; }).join('');
    $('#tr-list').innerHTML = TR.filter(function (t) { return filtro === 'tutti' || t.c === filtro; }).map(riga).join('');
  }
  function trattamento(id) {
    var t = byId(id) || TR[0];
    $('#t-box').innerHTML = (t.img ? '<img class="t-img" src="' + t.img + '" alt="" width="800" height="600">' : '<div class="t-ill" aria-hidden="true">' + FOGLIA + '</div>') +
      '<h1 id="t-nome">' + t.n + '</h1><p>' + t.d + '</p><div class="meta"><span>' + dur(t.min) + '</span><span>' + t.p + ' €</span><span>' + CAT.filter(function (c) { return c[0] === t.c; })[0][1] + '</span></div>' +
      '<h2 class="sec">Come si svolge</h2><ol class="fasi">' + t.fasi.map(function (f) { return '<li>' + f + '</li>'; }).join('') + '</ol><p class="adatto"><b>A chi è adatto.</b> ' + t.ok + '</p><a class="btn scuro full" href="#/prenota/' + t.id + '">Scegli giorno e ora</a>';
  }
  function prenota(id) {
    if (id && byId(id)) sel.tr = id;
    $('#pr-tr').innerHTML = TR.map(function (t) { return '<option value="' + t.id + '"' + (t.id === sel.tr ? ' selected' : '') + '>' + t.n + ' · ' + t.p + ' €</option>'; }).join('');
    disegna();
  }
  function disegna() {
    $('#pr-op').innerHTML = OP.map(function (o) { return '<button type="button" data-op="' + o[0] + '" aria-pressed="' + (o[0] === sel.op) + '">' + o[1] + '</button>'; }).join('');
    var g = '';
    for (var k = 0; k < 12; k++) { var d = giorno(k), chiuso = d.getDay() === 0 || d.getDay() === 1; g += '<button type="button" data-g="' + k + '" aria-pressed="' + (k === sel.g) + '"' + (chiuso ? ' disabled aria-label="' + GG[d.getDay()] + ' ' + d.getDate() + ', chiuso"' : '') + '><small>' + (k === 0 ? 'oggi' : GG[d.getDay()]) + '</small><b>' + d.getDate() + '</b></button>'; }
    $('#pr-giorni').innerHTML = g;
    var dd = giorno(sel.g); if (dd.getDay() === 0 || dd.getDay() === 1) { sel.g += dd.getDay() === 0 ? 2 : 1; return disegna(); }
    $('#pr-orari').innerHTML = ORARI.map(function (o, i) { var occ = occupato(sel.g, i, sel.op); if (occ && sel.ora === o) sel.ora = null; return '<button type="button" data-ora="' + o + '" aria-pressed="' + (sel.ora === o) + '"' + (occ ? ' disabled aria-label="' + o + ', occupato"' : '') + '>' + o + '</button>'; }).join('');
    var t = byId(sel.tr), op = OP.filter(function (o) { return o[0] === sel.op; })[0];
    $('#riep').innerHTML = sel.ora ? '<p class="g">' + t.n + '</p><p>' + GG[dd.getDay()] + ' ' + dd.getDate() + ' ' + MM[dd.getMonth()] + ' alle ' + sel.ora + ' · ' + dur(t.min) + '</p><p>' + (sel.op === 'chiunque' ? 'Con la prima estetista libera' : 'Con ' + op[1]) + ' · <b>' + t.p + ' €</b>, si paga in centro</p>' : '<p>Scegli un orario libero per vedere il riepilogo.</p>';
    $('#pr-ok').disabled = !sel.ora;
  }
  function agenda() {
    var lista = st.appt.concat([{ n: 'Manicure con semipermanente', gs: 'ven', gn: '', ora: '17:30', op: 'Elisa', es: 1 }]);
    $('#ag-box').innerHTML = (st.appt.length ? '' : '<p class="vuoto">Nessun appuntamento nuovo. <a href="#/prenota">Prenotane uno</a>.</p>') + '<ul class="ag">' + lista.map(function (a, i) {
      return '<li><span class="d"><small>' + a.gs + '</small><b>' + (a.gn || '28') + '</b></span><span class="info"><b>' + a.n + '</b><small>alle ' + a.ora + ' con ' + a.op + (a.es ? ' · esempio' : '') + '</small></span>' + (a.es ? '' : '<button type="button" data-annulla="' + i + '">Annulla</button>') + '</li>';
    }).join('') + '</ul>';
  }
  var R = { home: home, trattamenti: trattamenti, trattamento: trattamento, prenota: prenota, agenda: agenda };
  function route() {
    var p = location.hash.replace(/^#\/?/, '').split('/'), n = R[p[0]] ? p[0] : 'home';
    $$('[data-screen]').forEach(function (s) { s.hidden = s.dataset.screen !== n; });
    var tab = n === 'trattamento' ? 'trattamenti' : n;
    $$('.tabbar a').forEach(function (a) { if (a.dataset.tab === tab) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    R[n](p[1]); window.scrollTo(0, 0); var sc = document.querySelector('.app > main'); if (sc) sc.scrollTop = 0;
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.dataset.f) { filtro = b.dataset.f; trattamenti(); }
    else if (b.dataset.op) { sel.op = b.dataset.op; disegna(); }
    else if (b.dataset.g) { sel.g = +b.dataset.g; sel.ora = null; disegna(); }
    else if (b.dataset.ora) { sel.ora = b.dataset.ora; disegna(); }
    else if (b.dataset.annulla) { st.appt.splice(+b.dataset.annulla, 1); mem.set('stato', st); agenda(); }
  });
  $('#pr-tr').addEventListener('change', function () { sel.tr = this.value; disegna(); });
  $('#f-pr').addEventListener('submit', function (e) {
    e.preventDefault(); if (!sel.ora) return;
    var t = byId(sel.tr), d = giorno(sel.g), op = sel.op === 'chiunque' ? 'Marta' : OP.filter(function (o) { return o[0] === sel.op; })[0][1];
    st.appt.unshift({ n: t.n, gs: GG[d.getDay()], gn: d.getDate(), ora: sel.ora, op: op }); mem.set('stato', st);
    sel.ora = null; location.hash = '#/agenda';
  });
  window.addEventListener('hashchange', route);
  route();
})();
