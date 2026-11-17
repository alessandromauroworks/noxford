/* Nido Il Gelso - app dimostrativa. Nessun dato viene inviato: risposte, assenze e pagamenti restano in questo browser. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var mem = {
    get: function (k, d) { try { var v = localStorage.getItem('gelso-' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('gelso-' + k, JSON.stringify(v)); } catch (e) {} }
  };
  var GG = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var MM = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
  var IC = {
    arrivo: '<path d="M4 20V9l8-5 8 5v11M10 20v-6h4v6" fill="none" stroke="#7FA65A" stroke-width="1.8"/>',
    pappa: '<path d="M4 12a8 8 0 0 0 16 0zM12 4v4" fill="none" stroke="#D9824A" stroke-width="1.8" stroke-linecap="round"/>',
    gioco: '<rect x="4" y="12" width="7" height="7" fill="none" stroke="#8E3B6A" stroke-width="1.8"/><rect x="13" y="12" width="7" height="7" fill="none" stroke="#8E3B6A" stroke-width="1.8"/><rect x="8.5" y="5" width="7" height="7" fill="none" stroke="#8E3B6A" stroke-width="1.8"/>',
    nanna: '<path d="M18 15A7 7 0 0 1 9 6a7 7 0 1 0 9 9z" fill="none" stroke="#4E7EA3" stroke-width="1.8"/>',
    cambio: '<path d="M5 8h14l-2 10H7zM9 8V6h6v2" fill="none" stroke="#7FA65A" stroke-width="1.8"/>',
    uscita: '<path d="M14 4h5v16h-5M10 8l-4 4 4 4M6 12h9" fill="none" stroke="#7FA65A" stroke-width="1.8" stroke-linecap="round"/>'
  };
  var GIORNATA = [
    [8, 10, 'arrivo', 'arrivo', 'Entrata', 'L\'ha accompagnato papà. Un po\' di sonno, poi subito a giocare.'],
    [9, 0, 'pappa', 'pappa', 'Merenda', 'Mela grattugiata e un biscotto: mangiato tutto.'],
    [9, 30, 'gioco', 'gioco', 'Gioco in salone', 'Costruzioni di legno e travasi con la farina gialla.'],
    [10, 40, 'cambio', '', 'Cambio', 'Pannolino cambiato, tutto regolare.'],
    [11, 30, 'pappa', 'pappa', 'Pranzo', 'Pasta al pomodoro, merluzzo e carote. Ha chiesto il bis della pasta.'],
    [12, 45, 'nanna', 'nanna', 'Nanna', 'Si è addormentato da solo con il suo coniglietto.'],
    [14, 50, 'pappa', 'pappa', 'Merenda', 'Yogurt bianco e banana.'],
    [15, 30, 'gioco', 'gioco', 'Giardino', 'Sabbiera e bolle di sapone.'],
    [16, 0, 'uscita', '', 'Uscita', 'Ritiro previsto dalla nonna Anna, già autorizzata.']
  ];
  var AVV = [
    { id: 'gita', tag: 'Gita', d: 'oggi', t: 'Mattina alla fattoria didattica', p: 'Venerdì 28 andiamo a vedere gli asinelli, a dieci minuti dal nido. Partenza 9:30, rientro per il pranzo. Serve la vostra autorizzazione.', az: [['si', 'Autorizzo'], ['no', 'Non partecipa']] },
    { id: 'riunione', tag: 'Riunione', d: 'ieri', t: 'Incontro con i genitori dei Pulcini', p: 'Giovedì 4 dicembre alle 17:30 in salone: come sta andando l\'inserimento e la festa di Natale.', az: [['si', 'Ci sarò'], ['no', 'Non posso']] },
    { id: 'cambi', tag: 'Da portare', d: 'lun 10 nov', t: 'Cambio completo e calzini antiscivolo', p: 'Con il freddo usciamo comunque in giardino: un cambio in più nell\'armadietto, grazie.', az: [['letto', 'Ho letto']] },
    { id: 'ponte', tag: 'Chiusura', d: 'mar 4 nov', t: 'Lunedì 8 dicembre il nido è chiuso', p: 'Riapriamo martedì 9 alle 7:30 come sempre.', az: [['letto', 'Ho letto']] }
  ];
  var MENU = [
    { m: 'Mela grattugiata', p: 'Pasta al pomodoro', s: 'Merluzzo al forno', c: 'Carote al vapore', po: 'Yogurt bianco e banana', a: ['glutine', 'pesce', 'latte'] },
    { m: 'Pera e gallette di riso', p: 'Risotto alla zucca', s: 'Frittata alle erbe', c: 'Fagiolini', po: 'Pane e olio', a: ['uovo', 'latte', 'glutine'], sost: 'Frittata: per Tommaso polpettine di ceci' },
    { m: 'Banana', p: 'Minestra di verdure con orzo', s: 'Pollo al limone', c: 'Patate al forno', po: 'Budino di riso fatto da noi', a: ['glutine', 'latte', 'sedano'] },
    { m: 'Kiwi', p: 'Pasta con lenticchie', s: 'Formaggio fresco', c: 'Insalata di finocchi', po: 'Torta di mele', a: ['glutine', 'latte', 'uovo'], sost: 'Torta di mele: per Tommaso mela cotta con cannella' },
    { m: 'Clementine', p: 'Gnocchetti al ragù di verdure', s: 'Polpette di manzo', c: 'Piselli', po: 'Pane e marmellata', a: ['glutine', 'uovo'], sost: 'Polpette: per Tommaso preparate senza uovo' }
  ];
  var MOT = ['Malattia', 'Visita medica', 'Vacanza', 'Altro'];
  var st = mem.get('stato', { risp: {}, ass: [], pagato: false, metodo: 'carta' });
  var oggi = function () { var d = new Date(); d.setHours(12, 0, 0, 0); return d; };
  var feriale = function (d) { return d.getDay() > 0 && d.getDay() < 6; };
  var menuG = Math.min(4, Math.max(0, oggi().getDay() - 1));
  var asSel = { g: null, m: null };
  var salva = function () { mem.set('stato', st); contaAvvisi(); };
  var contaAvvisi = function () { var n = AVV.filter(function (a) { return !st.risp[a.id]; }).length; $('#n-avv').textContent = n || ''; };
  var ic = function (k) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + IC[k] + '</svg>'; };
  var faccina = function (c) { return '<svg viewBox="0 0 30 30" aria-hidden="true"><circle cx="15" cy="15" r="13" fill="' + c + '"/><circle cx="10.5" cy="12" r="1.6" fill="#3A2B33"/><circle cx="19.5" cy="12" r="1.6" fill="#3A2B33"/><path d="M9.5 18c3 3.5 8 3.5 11 0" fill="none" stroke="#3A2B33" stroke-width="1.8" stroke-linecap="round"/></svg>'; };

  function oggiScr() {
    var now = new Date(), d = oggi(), chiuso = !feriale(d), min = now.getHours() * 60 + now.getMinutes();
    if (chiuso) { while (!feriale(d)) d.setDate(d.getDate() - 1); min = 24 * 60; }
    $('#og-data').textContent = (chiuso ? 'Oggi il nido è chiuso. Ecco ' : '') + GG[d.getDay()] + ' ' + d.getDate() + ' ' + MM[d.getMonth()] + (chiuso ? '' : ', aggiornato dalle educatrici durante la giornata');
    var fatti = GIORNATA.filter(function (g) { return g[0] * 60 + g[1] <= min; });
    var pranzo = fatti.some(function (g) { return g[4] === 'Pranzo'; }), nanna = fatti.some(function (g) { return g[4] === 'Nanna'; });
    $('#og-umore').innerHTML = '<div>' + faccina('#E6F0DC') + 'Umore<b>sereno</b></div><div>' + faccina('#FDEBDD') + 'Pranzo<b>' + (pranzo ? 'tutto + bis' : 'alle 11:30') + '</b></div><div>' + faccina('#D8E8F3') + 'Nanna<b>' + (nanna ? (min >= 14 * 60 + 20 ? '1 h 35 min' : 'dorme ora') : 'dopo pranzo') + '</b></div>';
    $('#og-diario').innerHTML = GIORNATA.map(function (g) {
      var fatto = g[0] * 60 + g[1] <= min;
      return '<li class="' + g[3] + (fatto ? '' : ' dopo') + '"><span class="ic">' + ic(g[2]) + '</span><div class="tx"><span class="h">' + g[0] + ':' + ('0' + g[1]).slice(-2) + (fatto ? '' : ' · in programma') + '</span><b>' + g[4] + '</b>' + (fatto ? '<p>' + g[5] + '</p>' : '') + '</div></li>';
    }).join('');
  }
  function avvisi() {
    $('#av-lista').innerHTML = AVV.map(function (a) {
      var r = st.risp[a.id], lab = r && a.az.filter(function (x) { return x[0] === r; })[0];
      return '<li class="' + (r ? '' : 'nuovo') + '"><div class="h"><span class="tag">' + a.tag + '</span><span>' + a.d + '</span></div><h2>' + a.t + '</h2><p>' + a.p + '</p>' +
        (r ? '<span class="fatto">Risposta inviata: ' + lab[1].toLowerCase() + '</span>' : '<div class="az">' + a.az.map(function (x, i) { return '<button type="button" class="' + (i === 0 ? 'si' : '') + '" data-av="' + a.id + '" data-r="' + x[0] + '">' + x[1] + '</button>'; }).join('') + '</div>') + '</li>';
    }).join('');
  }
  function menu() {
    var lun = oggi(); lun.setDate(lun.getDate() - ((lun.getDay() + 6) % 7));
    if (!feriale(oggi())) lun.setDate(lun.getDate() + 7);
    $('#me-gg').innerHTML = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven'].map(function (n, i) { var d = new Date(lun); d.setDate(lun.getDate() + i); return '<button type="button" data-mg="' + i + '" aria-pressed="' + (i === menuG) + '">' + n + '<small>' + d.getDate() + '</small></button>'; }).join('');
    var m = MENU[menuG];
    $('#me-box').innerHTML = '<ul class="pasti"><li><span class="q">Merenda del mattino · 9:00</span><b>' + m.m + '</b></li><li><span class="q">Pranzo · 11:30</span><b>' + m.p + '</b><b>' + m.s + '</b><b>' + m.c + '</b><div class="all">' + m.a.map(function (x) { return '<span>' + x + '</span>'; }).join('') + '</div>' + (m.sost ? '<p class="sost">' + m.sost + '</p>' : '') + '</li><li><span class="q">Merenda del pomeriggio · 14:50</span><b>' + m.po + '</b></li></ul>';
  }
  function presenze() {
    var d0 = oggi(), y = d0.getFullYear(), mo = d0.getMonth(), primo = new Date(y, mo, 1), giorni = new Date(y, mo + 1, 0).getDate();
    var h = '<h2>' + MM[mo].charAt(0).toUpperCase() + MM[mo].slice(1) + ' ' + y + '</h2><div class="gr">' + ['L', 'M', 'M', 'G', 'V', 'S', 'D'].map(function (w) { return '<span class="w">' + w + '</span>'; }).join('');
    for (var v = 0; v < (primo.getDay() + 6) % 7; v++) h += '<span></span>';
    var pres = 0, assM = 0;
    for (var g = 1; g <= giorni; g++) {
      var d = new Date(y, mo, g, 12), c = '';
      var avvisata = st.ass.some(function (a) { return a.y === y && a.m === mo && a.g === g; });
      if (!feriale(d)) c = 'c';
      else if (d < d0) { if (g % 9 === 4) { c = 'a'; assM++; } else { c = 'p'; pres++; } }
      else if (avvisata) c = 'a';
      else if (+d === +d0) { c = 'p'; pres++; }
      h += '<span class="' + c + (+d === +d0 ? ' oggi' : '') + '">' + g + '</span>';
    }
    h += '</div><p class="tot">' + pres + ' giorni di presenza e ' + assM + ' di assenza questo mese</p>';
    $('#pr-cal').innerHTML = h;
    var gb = '', k = 0, dd = oggi();
    while (k < 6) { dd.setDate(dd.getDate() + 1); if (!feriale(dd)) continue; var key = dd.getFullYear() + '-' + dd.getMonth() + '-' + dd.getDate(); gb += '<button type="button" data-ag="' + key + '" aria-pressed="' + (asSel.g === key) + '"><small>' + GG[dd.getDay()].slice(0, 3) + '</small><b>' + dd.getDate() + '</b></button>'; k++; }
    $('#as-giorni').innerHTML = gb;
    $('#as-mot').innerHTML = MOT.map(function (m) { return '<button type="button" data-am="' + m + '" aria-pressed="' + (asSel.m === m) + '">' + m + '</button>'; }).join('');
    $('#as-lista').innerHTML = st.ass.map(function (a, i) { return '<li><span><b>' + GG[new Date(a.y, a.m, a.g).getDay()] + ' ' + a.g + ' ' + MM[a.m] + '</b><small>' + a.mot + ' · avvisata alle ' + a.h + '</small></span><button type="button" data-annulla="' + i + '">Annulla</button></li>'; }).join('');
  }
  function retta() {
    var d0 = oggi(), mo = d0.getMonth(), pasti = 0;
    for (var g = 1; g <= new Date(d0.getFullYear(), mo + 1, 0).getDate(); g++) { var d = new Date(d0.getFullYear(), mo, g, 12); if (feriale(d) && d <= d0 && g % 9 !== 4) pasti++; }
    var imp = 520 + pasti * 4.5, eu = function (n) { return n.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'; };
    $('#re-box').innerHTML = st.pagato ? '<div class="retta pagata"><small>Retta di ' + MM[mo] + '</small><b class="imp">' + eu(imp) + '</b><small>Pagata con ' + (st.metodo === 'carta' ? 'carta' : 'addebito in conto') + '. Grazie!</small></div>'
      : '<div class="retta"><small>Retta di ' + MM[mo] + ' · scade il 30</small><b class="imp">' + eu(imp) + '</b><ul class="voci"><li><span>Quota fissa tempo pieno</span><span>520,00 €</span></li><li><span>Pasti (' + pasti + ' × 4,50 €)</span><span>' + eu(pasti * 4.5) + '</span></li></ul><div class="metodi" role="group" aria-label="Metodo di pagamento"><button type="button" data-met="carta" aria-pressed="' + (st.metodo === 'carta') + '">Carta</button><button type="button" data-met="sepa" aria-pressed="' + (st.metodo === 'sepa') + '">Addebito in conto</button></div><button class="btn" type="button" id="re-paga">Paga ' + eu(imp) + ' (demo)</button></div>';
    $('#re-box').insertAdjacentHTML('beforeend', '<p class="bonus">Con la ricevuta puoi chiedere il rimborso del bonus nido sul sito dell\'INPS. La scarichi qui sotto ogni mese.</p><p class="nota">Demo: nessun pagamento vero. Nella versione vera si paga con il circuito della banca del nido.</p>');
    var R = [['Ottobre', '598,50 €'], ['Settembre', '565,00 €'], ['Iscrizione', '120,00 €']];
    if (st.pagato) R.unshift([MM[mo].charAt(0).toUpperCase() + MM[mo].slice(1), eu(imp)]);
    $('#re-ric').innerHTML = R.map(function (r) { return '<li><span><b>' + r[0] + '</b><small>ricevuta in PDF</small></span><b>' + r[1] + '</b></li>'; }).join('');
  }
  var R = { oggi: oggiScr, avvisi: avvisi, menu: menu, presenze: presenze, retta: retta };
  function route() {
    var p = location.hash.replace(/^#\/?/, '').split('/'), n = R[p[0]] ? p[0] : 'oggi';
    $$('[data-screen]').forEach(function (s) { s.hidden = s.dataset.screen !== n; });
    $$('.tabbar a').forEach(function (a) { if (a.dataset.tab === n) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    R[n](p[1]); window.scrollTo(0, 0); var sc = $('.app > main'); if (sc) sc.scrollTop = 0;
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.dataset.av) { st.risp[b.dataset.av] = b.dataset.r; salva(); avvisi(); }
    else if (b.dataset.mg) { menuG = +b.dataset.mg; menu(); }
    else if (b.dataset.ag) { asSel.g = b.dataset.ag; $('#as-err').textContent = ''; $$('[data-ag]').forEach(function (x) { x.setAttribute('aria-pressed', x.dataset.ag === asSel.g); }); }
    else if (b.dataset.am) { asSel.m = b.dataset.am; $('#as-err').textContent = ''; $$('[data-am]').forEach(function (x) { x.setAttribute('aria-pressed', x.dataset.am === asSel.m); }); }
    else if (b.dataset.annulla) { st.ass.splice(+b.dataset.annulla, 1); salva(); presenze(); }
    else if (b.dataset.met) { st.metodo = b.dataset.met; retta(); }
    else if (b.id === 're-paga') { st.pagato = true; salva(); retta(); }
  });
  $('#f-ass').addEventListener('submit', function (e) {
    e.preventDefault();
    if (!asSel.g || !asSel.m) { $('#as-err').textContent = !asSel.g ? 'Scegli il giorno.' : 'Scegli il motivo: aiuta le educatrici a organizzarsi.'; return; }
    var k = asSel.g.split('-').map(Number), n = new Date();
    if (!st.ass.some(function (a) { return a.y === k[0] && a.m === k[1] && a.g === k[2]; })) st.ass.push({ y: k[0], m: k[1], g: k[2], mot: asSel.m, h: n.getHours() + ':' + ('0' + n.getMinutes()).slice(-2) });
    asSel = { g: null, m: null }; salva(); presenze();
  });
  window.addEventListener('hashchange', route);
  contaAvvisi(); route();
})();
