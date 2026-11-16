/* Studio Sorriso Chiaro - app dimostrativa. Nessun dato viene inviato: tutto resta nel browser. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var mem = {
    get: function (k, d) { try { var v = localStorage.getItem('sorriso-' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('sorriso-' + k, JSON.stringify(v)); } catch (e) {} }
  };
  var GG = ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'], MM = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
  var giorno = function (k) { var d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + k); return d; };
  var SERV = [
    { id: 'igiene', n: 'Igiene e pulizia', d: 'Ablazione del tartaro, lucidatura e consigli su misura.', min: 45, p: 'da 80 €', img: 'img/studio.webp', dom: [['Fa male?', 'Di solito no. Se hai denti sensibili usiamo un gel che addormenta la gengiva.'], ['Ogni quanto?', 'Per la maggior parte delle persone ogni sei mesi.']] },
    { id: 'visita', n: 'Prima visita', d: 'Controllo completo, radiografia se serve e preventivo scritto.', min: 40, p: '50 €', img: 'img/attesa.webp', dom: [['Cosa porto?', 'Tessera sanitaria, eventuali radiografie recenti e l\'elenco dei farmaci che prendi.'], ['Il preventivo è vincolante?', 'No. Te lo diamo scritto e hai tutto il tempo per decidere.']] },
    { id: 'allineatori', n: 'Allineatori trasparenti', d: 'Mascherine quasi invisibili per raddrizzare i denti, anche da adulti.', min: 60, p: 'su preventivo', dom: [['Quanto dura?', 'Dipende dal caso: in genere da 8 a 18 mesi.'], ['Si vedono?', 'Molto poco. Si tolgono per mangiare e lavare i denti.']] },
    { id: 'impianti', n: 'Implantologia', d: 'Sostituzione di uno o più denti con impianti in titanio.', min: 90, p: 'su preventivo', dom: [['Posso pagare a rate?', 'Sì, il piano di cura si può dividere in rate senza interessi.'], ['Quanto ci vuole?', 'Dalla chirurgia alla corona passano di solito tre o quattro mesi.']] },
    { id: 'sbiancamento', n: 'Sbiancamento', d: 'In studio in una seduta, oppure a casa con le mascherine.', min: 75, p: 'da 250 €', dom: [['È sicuro?', 'Sì, se fatto dopo un\'igiene e su denti sani. Prima facciamo sempre un controllo.']] },
    { id: 'bambini', n: 'Dentista per bambini', d: 'Prime visite dai 3 anni, sigillature e controlli con calma.', min: 30, p: 'da 40 €', dom: [['Quando la prima visita?', 'Verso i 3 anni, anche solo per prendere confidenza con lo studio.']] }
  ];
  var MOTIVI = [['igiene', 'Igiene'], ['visita', 'Controllo'], ['dolore', 'Ho dolore'], ['allineatori', 'Allineatori']];
  var ORARI = ['9:00', '9:45', '10:30', '11:15', '12:00', '15:00', '15:45', '16:30', '17:15', '18:00'];
  var PROM = [
    { id: 'igiene6', n: 'Igiene ogni 6 mesi', d: 'Ti scriviamo un mese prima della scadenza. Ultima igiene: 12 maggio.', on: true },
    { id: 'appt', n: 'Il giorno prima di ogni appuntamento', d: 'Messaggio alle 18 con orario e indirizzo.', on: true },
    { id: 'spazzolino', n: 'Cambio dello spazzolino', d: 'Ogni tre mesi.', on: false },
    { id: 'rate', n: 'Scadenza delle rate', d: 'Tre giorni prima di ogni rata del piano di cura.', on: false }
  ];
  var FASI = [['Visita e radiografie', '2 ottobre', 1], ['Inserimento dell\'impianto', '16 ottobre', 1], ['Controllo della guarigione', '27 novembre', 0], ['Impronta digitale', 'gennaio', 0], ['Corona definitiva', 'febbraio', 0]];
  var st = mem.get('stato', { appt: null, prom: PROM.reduce(function (o, p) { o[p.id] = p.on; return o; }, {}), pagate: 2 });
  var sel = { m: 'igiene', g: 1, ora: null };
  var byId = function (id) { return SERV.filter(function (s) { return s.id === id; })[0]; };
  var occupato = function (g, i) { return ((giorno(g).getDate() * 3 + i * 5) % 7) < 3; };
  var aperto = function (g) { var d = giorno(g).getDay(); return d !== 0 && d !== 6; };
  function toast(t) { var el = $('#toast'); el.textContent = t; el.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(function () { el.classList.remove('on'); }, 2600); }
  function salva() { mem.set('stato', st); }

  function home() {
    var a = st.appt, d = a ? new Date(a.data) : giorno(9);
    while (!a && (d.getDay() === 0 || d.getDay() === 6)) d.setDate(d.getDate() + 1);
    $('#next').innerHTML = '<a href="#/' + (a ? 'prenota' : 'piano') + '"><small>' + (a ? 'Richiesta inviata' : 'Prossimo appuntamento') + '</small><b>' + (a ? GG[d.getDay()] + ' ' + d.getDate() + ' ' + MM[d.getMonth()] + ', ' + a.ora : 'venerdì 27 novembre, 15:45') + '</b><span>' + (a ? a.m : 'Controllo della guarigione · Dott.ssa Neri') + '</span><div class="row"><i>Sala 2</i><i>' + (a ? 'In attesa di conferma' : 'Durata 20 min') + '</i></div></a>';
    var n = Object.keys(st.prom).filter(function (k) { return st.prom[k]; }).length;
    $('#n-prom').textContent = n + (n === 1 ? ' attivo' : ' attivi');
  }
  function servizi() {
    $('#serv').innerHTML = SERV.map(function (s) { return '<li><a href="#/servizio/' + s.id + '"><span class="ic" aria-hidden="true">' + s.n[0] + '</span><span><b>' + s.n + '</b><small>' + s.d + '</small></span><span class="ar" aria-hidden="true">›</span></a></li>'; }).join('');
  }
  function servizio(id) {
    var s = byId(id) || SERV[0];
    $('#s-box').innerHTML = (s.img ? '<img class="s-img" src="' + s.img + '" alt="" width="800" height="500">' : '') + '<h1 id="s-nome">' + s.n + '</h1><p>' + s.d + '</p><div class="info"><div><small>Durata</small><b>' + s.min + ' minuti</b></div><div><small>Prezzo</small><b>' + s.p + '</b></div></div><h2 class="sec">Le domande che ci fate</h2><ul class="dom">' + s.dom.map(function (q) { return '<li><b>' + q[0] + '</b><span>' + q[1] + '</span></li>'; }).join('') + '</ul><a class="btn teal full" href="#/prenota/' + (MOTIVI.some(function (m) { return m[0] === s.id; }) ? s.id : 'visita') + '">Prenota</a>';
  }
  function prenota(m) {
    if (m && MOTIVI.some(function (x) { return x[0] === m; })) sel.m = m;
    disegna();
  }
  function disegna() {
    $('#motivi').innerHTML = MOTIVI.map(function (x) { return '<button type="button" data-m="' + x[0] + '" aria-pressed="' + (sel.m === x[0]) + '">' + x[1] + '</button>'; }).join('');
    if (!aperto(sel.g)) { while (!aperto(sel.g)) sel.g++; }
    var g = ''; for (var k = 1, c = 0; c < 8; k++) { if (!aperto(k)) continue; c++; var d = giorno(k); g += '<button type="button" data-g="' + k + '" aria-pressed="' + (k === sel.g) + '"><small>' + GG[d.getDay()] + '</small><b>' + d.getDate() + '</b></button>'; }
    $('#giorni').innerHTML = g;
    var urg = sel.m === 'dolore';
    $('#orari').innerHTML = ORARI.map(function (o, i) { var occ = occupato(sel.g, i) && !(urg && i === 4); if (occ && sel.ora === o) sel.ora = null; return '<button type="button" data-ora="' + o + '" aria-pressed="' + (sel.ora === o) + '"' + (occ ? ' disabled aria-label="' + o + ', occupato"' : '') + '>' + o + '</button>'; }).join('');
    var d2 = giorno(sel.g), mot = MOTIVI.filter(function (x) { return x[0] === sel.m; })[0][1];
    $('#riep').innerHTML = (urg ? '<p><b>Per il dolore teniamo sempre libero un posto alle 12:00.</b> Se è forte, tocca Urgenza in alto.</p>' : '') + (sel.ora ? '<p><b>' + mot + '</b>, ' + GG[d2.getDay()] + ' ' + d2.getDate() + ' ' + MM[d2.getMonth()] + ' alle ' + sel.ora + '</p>' : '<p>Scegli un orario libero.</p>');
    $('#pr-ok').disabled = !sel.ora;
  }
  function promemoria() {
    $('#prom').innerHTML = PROM.map(function (p) { var on = !!st.prom[p.id]; return '<li><div><b>' + p.n + '</b><small>' + p.d + '</small></div><button class="sw" type="button" role="switch" aria-checked="' + on + '" data-sw="' + p.id + '" aria-label="' + p.n + '"></button></li>'; }).join('');
  }
  function piano() {
    var rate = [480, 480, 480, 480, 480], pagato = rate.slice(0, st.pagate).reduce(function (a, b) { return a + b; }, 0);
    $('#pagato-bar').style.width = Math.round(pagato / 2400 * 100) + '%';
    $('#pagato-tx').textContent = 'Pagati ' + String(pagato).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' € su 2.400 € · 5 rate senza interessi';
    var ora = FASI.findIndex ? FASI.findIndex(function (f) { return !f[2]; }) : 2;
    $('#fasi').innerHTML = FASI.map(function (f, i) { return '<li class="' + (f[2] ? 'ok' : i === ora ? 'ora' : '') + '"><span><b>' + f[0] + '</b><small>' + (f[2] ? 'Fatto il ' : i === ora ? 'Prossimo: ' : 'Previsto a ') + f[1] + '</small></span></li>'; }).join('');
    var mesi = ['ottobre', 'novembre', 'dicembre', 'gennaio', 'febbraio'];
    $('#rate').innerHTML = rate.map(function (r, i) { var pag = i < st.pagate; return '<li><div><b>Rata ' + (i + 1) + ' · ' + r + ' €</b><small>' + (pag ? 'Pagata' : 'Scade il 5 ' + mesi[i]) + '</small></div>' + (pag ? '<span class="pag">Pagata</span>' : i === st.pagate ? '<button type="button" id="paga">Paga (demo)</button>' : '') + '</li>'; }).join('');
  }
  var R = { home: home, servizi: servizi, servizio: servizio, prenota: prenota, promemoria: promemoria, piano: piano };
  function route() {
    var p = location.hash.replace(/^#\/?/, '').split('/'), n = R[p[0]] ? p[0] : 'home';
    $$('[data-screen]').forEach(function (s) { s.hidden = s.dataset.screen !== n; });
    var tab = n === 'servizio' ? 'servizi' : n;
    $$('.tabbar a').forEach(function (a) { if (a.dataset.tab === tab) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    R[n](p[1]); window.scrollTo(0, 0); var sc = document.querySelector('.app > main'); if (sc) sc.scrollTop = 0;
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.dataset.m) { sel.m = b.dataset.m; disegna(); }
    else if (b.dataset.g) { sel.g = +b.dataset.g; sel.ora = null; disegna(); }
    else if (b.dataset.ora) { sel.ora = b.dataset.ora; disegna(); }
    else if (b.dataset.sw) { st.prom[b.dataset.sw] = !st.prom[b.dataset.sw]; salva(); promemoria(); toast(st.prom[b.dataset.sw] ? 'Promemoria attivato' : 'Promemoria spento'); }
    else if (b.id === 'paga') { st.pagate = Math.min(5, st.pagate + 1); salva(); piano(); toast('Demo: nessun pagamento reale. Rata segnata come pagata.'); }
    else if (b.id === 'sos') toast('Nella versione vera qui parte la chiamata allo studio. In questa demo il numero non c\'è.');
  });
  $('#f-pr').addEventListener('submit', function (e) {
    e.preventDefault(); if (!sel.ora) return;
    st.appt = { data: giorno(sel.g).getTime(), ora: sel.ora, m: MOTIVI.filter(function (x) { return x[0] === sel.m; })[0][1] }; salva();
    sel.ora = null; toast('Richiesta pronta: in questa demo non viene inviata'); location.hash = '#/home';
  });
  window.addEventListener('hashchange', route);
  route();
})();
