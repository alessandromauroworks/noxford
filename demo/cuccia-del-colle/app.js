/* La Cuccia del Colle - app dimostrativa. Nessun dato viene inviato: tutto resta nel browser. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var euro = function (n) { return (n % 1 ? n.toFixed(2).replace('.', ',') : n) + ' €'; };
  var mem = {
    get: function (k, d) { try { var v = localStorage.getItem('cuccia-' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('cuccia-' + k, JSON.stringify(v)); } catch (e) {} }
  };
  var IC = {
    casa: '<svg viewBox="0 0 48 48"><path d="M6 22 24 8l18 14v18H6z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M18 40V28h12v12" fill="none" stroke="currentColor" stroke-width="3"/></svg>',
    sole: '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="8" fill="none" stroke="currentColor" stroke-width="3"/><path d="M24 4v6M24 38v6M4 24h6M38 24h6M10 10l4 4M34 34l4 4M38 10l-4 4M14 34l-4 4" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>',
    bosco: '<svg viewBox="0 0 48 48"><path d="M16 6 6 26h20zM16 18 4 38h24zM16 38v6M34 12l-8 16h16zM34 28v16" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/></svg>',
    fischio: '<svg viewBox="0 0 48 48"><circle cx="18" cy="28" r="10" fill="none" stroke="currentColor" stroke-width="3"/><path d="M26 22 42 12v10l-12 6" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/></svg>'
  };
  var TAGLIE = [['piccola', 'Piccola', 'fino a 10 kg'], ['media', 'Media', '10-25 kg'], ['grande', 'Grande', 'oltre 25 kg']];
  var SERV = [
    { id: 'pensione', n: 'Pensione', d: 'Stanza sua, due uscite al giorno sul prato, foto ogni sera.', u: 'a notte', p: [24, 28, 33], img: 'img/stanza.webp', notti: 1,
      incl: ['Stanza singola riscaldata con cuccia e coperta', 'Tre ore al giorno sul prato in piccoli gruppi', 'Pasti con il suo cibo, agli orari di casa', 'Foto e messaggio ogni sera su WhatsApp', 'Veterinario di fiducia a 10 minuti'] },
    { id: 'asilo', n: 'Asilo di giorno', d: 'Dalle 8 alle 19: gioco, riposo e compagnia mentre lavori.', u: 'al giorno', p: [18, 20, 23], ic: 'sole',
      incl: ['Ingresso dalle 7:30 alle 9:30', 'Gruppi divisi per taglia e carattere', 'Pisolino in stanza dopo pranzo', 'Pacchetto 10 giorni con uno in omaggio'] },
    { id: 'toeletta', n: 'Toelettatura', d: 'Bagno, asciugatura, taglio e unghie. Prodotti delicati.', u: 'a seduta', p: [30, 40, 55], img: 'img/toelettatura.webp',
      incl: ['Bagno con shampoo per il suo tipo di pelo', 'Asciugatura e spazzolatura', 'Taglio a forbice o macchinetta', 'Unghie e pulizia delle orecchie', 'Circa due ore, ti avvisiamo quando è pronto'] },
    { id: 'bosco', n: 'Passeggiata nel bosco', d: 'Due ore sui sentieri del colle, massimo quattro cani.', u: 'a uscita', p: [15, 15, 18], ic: 'bosco',
      incl: ['Ritiro sotto casa entro 10 km', 'Guinzaglio lungo e acqua al seguito', 'Asciugatura zampe prima del rientro'] },
    { id: 'educazione', n: 'Educazione di base', d: 'Richiamo, guinzaglio e calma in casa, con l\'educatrice.', u: '5 lezioni', p: [180, 180, 180], ic: 'fischio',
      incl: ['Cinque incontri da 50 minuti', 'Esercizi da fare a casa, spiegati semplici', 'Una lezione in città, tra le persone'] }
  ];
  var CANI = [['birba', 'Birba', 'meticcia, 14 kg', 'media'], ['otto', 'Otto', 'bassotto, 8 kg', 'piccola']];
  var st = mem.get('stato', { taglia: 'media', richieste: [] });
  var byId = function (id) { return SERV.filter(function (s) { return s.id === id; })[0]; };
  var ti = function (t) { return TAGLIE.map(function (x) { return x[0]; }).indexOf(t); };
  var icona = function (s, cls) { return s.img ? '<img class="' + (cls || '') + '" src="' + s.img + '" alt="" loading="lazy" width="400" height="300">' : '<span class="' + (cls || '') + '" aria-hidden="true">' + IC[s.ic] + '</span>'; };
  var oggi = function (d) { var x = new Date(); x.setDate(x.getDate() + (d || 0)); return x.toISOString().slice(0, 10); };
  var fmt = function (iso) { return new Date(iso + 'T12:00').toLocaleDateString('it-IT', { day: 'numeric', month: 'long' }); };

  function home() {
    var r = st.richieste[0];
    $('#next').innerHTML = '<a class="card" href="#/cane"><span class="dot">B</span><span><b>' + (r ? r.serv + ' per ' + r.cani : 'Birba è da noi') + '</b><small>' + (r ? 'dal ' + fmt(r.dal) + ' · richiesta inviata' : 'Guarda il diario di oggi e la foto della sera') + '</small></span><span class="go" aria-hidden="true">→</span></a>';
    $('#home-serv').innerHTML = SERV.slice(0, 4).map(function (s) { return '<a href="#/servizio/' + s.id + '"><b>' + s.n + '</b><span>da ' + euro(s.p[0]) + ' ' + s.u + '</span></a>'; }).join('');
  }
  function servizi() {
    var i = ti(st.taglia);
    $('#taglie').innerHTML = TAGLIE.map(function (t) { return '<button type="button" data-taglia="' + t[0] + '" aria-pressed="' + (t[0] === st.taglia) + '">' + t[1] + '<small>' + t[2] + '</small></button>'; }).join('');
    $('#serv-list').innerHTML = SERV.map(function (s) { return '<li><a href="#/servizio/' + s.id + '"><span class="ic">' + icona(s) + '</span><span><b>' + s.n + '</b><small>' + s.d + '</small><span class="pr">' + euro(s.p[i]) + ' ' + s.u + '</span></span></a></li>'; }).join('');
  }
  function servizio(id) {
    var s = byId(id) || SERV[0];
    $('#s-box').innerHTML = icona(s, 's-img') + '<h1 id="s-nome">' + s.n + '</h1><p class="lead">' + s.d + '</p>' +
      '<div class="listino">' + TAGLIE.map(function (t, i) { return '<div><small>' + t[1] + '</small><b>' + euro(s.p[i]) + '</b><small>' + s.u + '</small></div>'; }).join('') + '</div>' +
      '<h2 class="sec">Cosa comprende</h2><ul class="incl">' + s.incl.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>' +
      '<a class="btn verde full" href="#/prenota/' + s.id + '">Prenota ' + s.n.toLowerCase() + '</a>';
  }
  function prenota(id) {
    $('#ok').hidden = true; $('#f-pren').hidden = false;
    var sel = $('#p-serv');
    sel.innerHTML = SERV.map(function (s) { return '<option value="' + s.id + '">' + s.n + '</option>'; }).join('');
    if (id && byId(id)) sel.value = id;
    if (!$('#p-dal').value) { $('#p-dal').value = oggi(3); $('#p-al').value = oggi(7); }
    $('#p-dal').min = oggi(1); $('#p-al').min = oggi(2);
    if (!$('#p-cani').children.length) $('#p-cani').innerHTML = CANI.map(function (c, i) { return '<label><input type="checkbox" name="cane" value="' + c[0] + '" data-t="' + c[3] + '"' + (i ? '' : ' checked') + '><span>' + c[1] + '<small>' + c[2] + '</small></span></label>'; }).join('');
    conto();
  }
  function calcola() {
    var s = byId($('#p-serv').value), dal = $('#p-dal').value, al = $('#p-al').value, err = '';
    var giorni = 1;
    if (s.notti) {
      giorni = Math.round((new Date(al) - new Date(dal)) / 864e5);
      if (!dal || !al) err = 'Scegli le date di arrivo e di partenza.';
      else if (giorni < 1) err = 'La partenza deve essere dopo l\'arrivo.';
      else if (giorni > 30) err = 'Per soggiorni oltre 30 notti chiamaci: facciamo un prezzo a parte.';
    } else if (!dal) err = 'Scegli il giorno.';
    var cani = $$('input[name=cane]:checked');
    if (!err && !cani.length) err = 'Scegli almeno un cane.';
    var righe = [], tot = 0;
    if (!err) {
      cani.forEach(function (c, k) {
        var p = s.p[ti(c.dataset.t)] * (s.notti ? giorni : 1), sconto = k ? .15 : 0;
        righe.push([c.parentNode.querySelector('span').firstChild.textContent + ' · ' + (s.notti ? giorni + (giorni === 1 ? ' notte' : ' notti') : s.u) + (sconto ? ' (−15% secondo cane)' : ''), p * (1 - sconto)]);
        tot += p * (1 - sconto);
      });
      $$('input[name=ex]:checked').forEach(function (e) { var p = +e.dataset.p * (e.dataset.notte ? Math.max(1, giorni) : 1) * cani.length; righe.push([e.parentNode.querySelector('span').textContent, p]); tot += p; });
    }
    return { s: s, err: err, righe: righe, tot: tot, giorni: giorni, cani: cani.map(function (c) { return c.parentNode.querySelector('span').firstChild.textContent; }) };
  }
  function conto() {
    var s = byId($('#p-serv').value);
    $('#w-al').hidden = !s.notti; $('#l-dal').textContent = s.notti ? 'Arrivo' : 'Giorno';
    $('#w-al').parentNode.classList.toggle('uno', !s.notti);
    var c = calcola();
    $('#e-date').textContent = c.err;
    $('#conto').innerHTML = c.err ? '<p>Completa i dati per vedere il prezzo.</p>' : c.righe.map(function (r) { return '<p><span>' + r[0] + '</span><span>' + euro(r[1]) + '</span></p>'; }).join('') + '<p class="g"><span>Totale</span><span>' + euro(Math.round(c.tot * 100) / 100) + '</span></p>';
  }
  function cane() {}
  var R = { home: home, servizi: servizi, servizio: servizio, prenota: prenota, cane: cane };
  function route() {
    var p = location.hash.replace(/^#\/?/, '').split('/'), n = R[p[0]] ? p[0] : 'home';
    $$('[data-screen]').forEach(function (s) { s.hidden = s.dataset.screen !== n; });
    var tab = n === 'servizio' ? 'servizi' : n;
    $$('.tabbar a').forEach(function (a) { if (a.dataset.tab === tab) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    R[n](p[1]); window.scrollTo(0, 0); var sc = document.querySelector('.app > main'); if (sc) sc.scrollTop = 0;
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest('button[data-taglia]'); if (t) { st.taglia = t.dataset.taglia; mem.set('stato', st); servizi(); }
  });
  $('#f-pren').addEventListener('input', conto);
  $('#f-pren').addEventListener('change', conto);
  $('#f-pren').addEventListener('submit', function (e) {
    e.preventDefault();
    var c = calcola();
    if (c.err) { $('#e-date').textContent = c.err; $('#p-dal').focus(); return; }
    st.richieste.unshift({ serv: c.s.n, cani: c.cani.join(' e '), dal: $('#p-dal').value, tot: c.tot }); mem.set('stato', st);
    $('#f-pren').hidden = true;
    var ok = $('#ok'); ok.hidden = false;
    ok.innerHTML = '<h2>Richiesta pronta</h2><p><b>' + c.s.n + '</b> per ' + c.cani.join(' e ') + ', ' + (c.s.notti ? 'dal ' + fmt($('#p-dal').value) + ' al ' + fmt($('#p-al').value) : 'il ' + fmt($('#p-dal').value)) + '.</p><p>Totale indicativo: <b>' + euro(Math.round(c.tot * 100) / 100) + '</b>.</p><p class="nota">Questa è una demo: la richiesta non è stata inviata. Nella versione vera arriva al telefono della pensione e ti rispondiamo entro un\'ora.</p><a class="btn verde full" href="#/cane">Vai alla scheda di Birba</a>';
    ok.setAttribute('tabindex', '-1'); ok.focus(); window.scrollTo(0, 0); var sc = document.querySelector('.app > main'); if (sc) sc.scrollTop = 0;
  });
  window.addEventListener('hashchange', route);
  route();
})();
