/* Studio Arco - app dimostrativa. La telefonata è simulata e nessun dato viene inviato.
   L'assistente dice sempre all'inizio di essere un assistente automatico e passa a una persona quando glielo chiedono. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var mem = {
    get: function (k, d) { try { var v = localStorage.getItem('arco-' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('arco-' + k, JSON.stringify(v)); } catch (e) {} }
  };
  var GG = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var giorno = function (k) { var d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + k); return d; };
  var prossimo = function (wd) { for (var k = 1; k < 9; k++) if (giorno(k).getDay() === wd) return k; return 2; };
  var kGio = prossimo(4), dGio = giorno(kGio);
  var APERTURA = 'Buongiorno, Studio Arco fisioterapia. <mark>Sono l\'assistente automatico dello studio, non una persona</mark>: posso fissare un appuntamento o darle informazioni. Se preferisce parlare con la segreteria, me lo dica quando vuole.';
  var COPIONE = [
    ['ai', APERTURA.replace(/<\/?mark>/g, '')],
    ['pz', 'Buongiorno, vorrei prenotare una visita, ho mal di schiena da una settimana.', { motivo: 'Mal di schiena da una settimana' }],
    ['ai', 'Mi dispiace. È la prima volta che viene da noi?'],
    ['pz', 'Sì, è la prima volta.', { tipo: 'Prima valutazione · 50 min · 60 €' }],
    ['ai', 'Per la prima valutazione servono 50 minuti e costa 60 euro. Ha una prescrizione del medico? Non è obbligatoria.'],
    ['pz', 'No, non ce l\'ho.', { pres: 'No, non serve' }],
    ['ai', 'Va bene lo stesso. Il primo posto libero è ' + GG[dGio.getDay()] + ' alle 15:30 con la dottoressa Neri, oppure venerdì alle 9 con il dottor Sala. Quale preferisce?'],
    ['pz', 'Giovedì alle 15:30 va benissimo.', { quando: GG[dGio.getDay()] + ' ' + dGio.getDate() + ', 15:30 · dott.ssa Neri' }],
    ['ai', 'Perfetto. Mi dice nome e cognome?'],
    ['pz', 'Paola Ferretti.', { nome: 'Paola Ferretti' }],
    ['ai', 'Grazie, signora Ferretti. Le confermo ' + GG[dGio.getDay()] + ' ' + dGio.getDate() + ' alle 15:30 con la dottoressa Neri, sala 1. Le mando un SMS con l\'indirizzo. Porti una tuta comoda ed eventuali esami. Posso aiutarla in altro?'],
    ['pz', 'No, grazie, arrivederci.'],
    ['sis', 'Chiamata chiusa · appuntamento salvato in agenda', { fine: 1 }]
  ];
  var CH = [
    { id: 'c7', ora: '10:42', chi: '+39 333 ••• •• 07', es: 'app', dur: '1:35', t: 'Seduta di tecar per il ginocchio', r: ['Paziente già in cura, quarta seduta su sei', 'Spostata da mercoledì a venerdì alle 11', 'SMS di conferma inviato'], tr: [['ai', 'Buongiorno, Studio Arco. Sono l\'assistente automatico dello studio...'], ['pz', 'Devo spostare la seduta di mercoledì.'], ['ai', 'Certo. Venerdì alle 11 con il dottor Sala va bene?'], ['pz', 'Perfetto, grazie.']] },
    { id: 'c6', ora: '10:15', chi: '+39 347 ••• •• 51', es: 'inf', dur: '0:58', t: 'Domanda sul pavimento pelvico', r: ['Chiedeva se fate riabilitazione del pavimento pelvico', 'Risposto: sì, con la dottoressa Neri, il martedì e il giovedì', 'Non ha prenotato, richiamerà'], tr: [['ai', 'Buongiorno, Studio Arco. Sono l\'assistente automatico dello studio...'], ['pz', 'Fate riabilitazione del pavimento pelvico?'], ['ai', 'Sì, la segue la dottoressa Neri il martedì e il giovedì. Vuole che le cerchi un posto?'], ['pz', 'Ci penso e richiamo, grazie.']] },
    { id: 'c5', ora: '9:48', chi: '+39 320 ••• •• 33', es: 'pas', dur: '0:41', t: 'Voleva parlare con una persona', r: ['Ha chiesto subito della segreteria', 'Passata a Sara in 4 secondi'], tr: [['ai', 'Buongiorno, Studio Arco. Sono l\'assistente automatico dello studio...'], ['pz', 'Preferisco parlare con qualcuno.'], ['ai', 'Certo, la passo subito alla segreteria.']] },
    { id: 'c4', ora: '9:20', chi: '+39 349 ••• •• 92', es: 'ric', dur: '1:12', t: 'Dolore forte dopo una caduta', r: ['Caduta ieri, dolore forte al polso', 'L\'assistente ha consigliato di farsi vedere al pronto soccorso prima della fisioterapia', 'Chiesto alla segreteria di richiamare domani'], tr: [['ai', 'Buongiorno, Studio Arco. Sono l\'assistente automatico dello studio...'], ['pz', 'Sono caduta ieri e il polso mi fa molto male.'], ['ai', 'Con un dolore forte dopo una caduta è meglio farsi vedere da un medico o al pronto soccorso. Io non posso dare consigli medici. Vuole che la segreteria la richiami domani?'], ['pz', 'Sì, grazie.']] },
    { id: 'c3', ora: '8:55', chi: '+39 338 ••• •• 14', es: 'app', dur: '1:48', t: 'Prima visita per cervicale', r: ['Nuovo paziente, cervicale', 'Prenotato lunedì alle 17 con il dottor Sala'], tr: [['ai', 'Buongiorno, Studio Arco. Sono l\'assistente automatico dello studio...'], ['pz', 'Vorrei una visita per la cervicale.'], ['ai', 'Lunedì alle 17 con il dottor Sala, le va bene?'], ['pz', 'Sì.']] },
    { id: 'c2', ora: '8:31', chi: '+39 340 ••• •• 60', es: 'inf', dur: '0:37', t: 'Orari del sabato', r: ['Chiedeva gli orari del sabato', 'Risposto: dalle 9 alle 13'], tr: [['ai', 'Buongiorno, Studio Arco. Sono l\'assistente automatico dello studio...'], ['pz', 'Siete aperti il sabato?'], ['ai', 'Sì, dalle 9 alle 13.']] },
    { id: 'c1', ora: '7:52', chi: '+39 366 ••• •• 28', es: 'ric', dur: '0:29', t: 'Chiamata prima dell\'apertura', r: ['Ha lasciato nome e numero', 'Da richiamare dopo le 9'], tr: [['ai', 'Buongiorno, Studio Arco. Sono l\'assistente automatico dello studio. Lo studio apre alle 8:30...'], ['pz', 'Mi richiamate? Sono Bruno.']] }
  ];
  var ES = { app: 'Appuntamento', ric: 'Da richiamare', inf: 'Informazioni', pas: 'Passata a una persona' };
  var FIL = [['tutte', 'Tutte'], ['app', 'Appuntamenti'], ['ric', 'Da richiamare'], ['inf', 'Informazioni'], ['pas', 'Segreteria']];
  var AG = [
    [1, '9:00', 'Marco Bellini', 'Tecar ginocchio · dott. Sala', 'seg'], [1, '11:30', 'Lucia Moro', 'Massoterapia · dott.ssa Neri', 'ai'], [1, '17:00', 'Gianni Rota', 'Prima valutazione cervicale · dott. Sala', 'ai'],
    [kGio, '10:00', 'Anna Greco', 'Pavimento pelvico · dott.ssa Neri', 'seg'], [kGio, '14:30', 'Piero Villa', 'Rieducazione spalla · dott. Sala', 'ai'],
    [prossimo(5), '9:00', 'Elena Costa', 'Linfodrenaggio · dott.ssa Neri', 'seg'], [prossimo(5), '11:00', 'Davide Fumagalli', 'Tecar ginocchio, spostata · dott. Sala', 'ai']
  ];
  var REG = [['auto', 'Dice sempre che è un assistente automatico', 'all\'inizio di ogni chiamata', 1, 1], ['umano', 'Passa a una persona quando lo chiedono', 'oppure dopo due risposte non capite', 1, 1], ['medico', 'Non dà consigli medici', 'per un dolore forte consiglia il medico o il 112', 1, 1], ['app', 'Prende e sposta appuntamenti', 'solo negli orari liberi dell\'agenda', 1, 0], ['sms', 'Manda un SMS di conferma', 'con indirizzo e cosa portare', 1, 0], ['fuori', 'Risponde quando lo studio è chiuso', 'la sera e la domenica', 1, 0], ['reg', 'Registra la chiamata', 'solo se la persona dice di sì', 0, 0]];
  var st = mem.get('stato', { fatta: false, reg: {}, ag: null });
  var fil = 'tutte', agG = 1, tick = null, passo = 0, sec = 0, cap = {};
  var ridotto = function () { return window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches; };
  var mm = function (s) { return ('0' + Math.floor(s / 60)).slice(-2) + ':' + ('0' + s % 60).slice(-2); };
  var esc = function (s) { return s.replace(/</g, '&lt;'); };

  function onda(on) { var o = $('#ch-onda'); if (!o.children.length) { var h = ''; for (var i = 0; i < 22; i++) h += '<i style="animation-delay:' + (i % 7) * 0.12 + 's"></i>'; o.innerHTML = h; } o.classList.toggle('ferma', !on); }
  function disegnaCapito() {
    var R = [['Motivo', cap.motivo], ['Tipo', cap.tipo], ['Prescrizione', cap.pres], ['Quando', cap.quando], ['Nome', cap.nome]];
    $('#ch-capito').innerHTML = '<h2>Cosa ha capito l\'assistente</h2><dl>' + R.map(function (r) { return '<dt>' + r[0] + '</dt><dd' + (r[1] ? '' : ' class="vuoto"') + '>' + (r[1] || 'in ascolto…') + '</dd>'; }).join('') + '</dl>' + (cap.fine && cap.nome ? '<p class="preso">Appuntamento salvato in agenda e SMS di conferma pronto.</p>' : cap.umano ? '<p class="preso" style="color:var(--ambra);background:rgba(255,181,71,.12)">Passata alla segreteria: Sara vede già cosa ha detto il paziente.</p>' : '');
  }
  function riga(l) { return '<li class="' + l[0] + '">' + (l[0] === 'sis' ? '' : '<small>' + (l[0] === 'ai' ? 'Assistente automatico' : 'Paziente') + '</small>') + esc(l[1]) + '</li>'; }
  function avanza() {
    if (passo >= COPIONE.length) return fine();
    var l = COPIONE[passo++]; if (l[2]) Object.keys(l[2]).forEach(function (k) { cap[k] = l[2][k]; });
    var t = $('#ch-trasc'); var s = t.querySelector('.scrivendo'); if (s) s.remove();
    t.insertAdjacentHTML('beforeend', riga(l));
    if (passo < COPIONE.length && !cap.fine) t.insertAdjacentHTML('beforeend', '<li class="' + COPIONE[passo][0] + ' scrivendo"><span class="scrive" aria-label="sta parlando"><i></i><i></i><i></i></span></li>');
    sec += l[0] === 'sis' ? 0 : 6 + Math.round(l[1].length / 12);
    $('#ch-tempo').textContent = mm(sec);
    disegnaCapito();
    if (cap.fine) fine();
  }
  function fine() {
    clearInterval(tick); tick = null; onda(false);
    $('#ch-stato').textContent = cap.umano ? 'Passata alla segreteria' : 'Chiamata terminata'; $('#ch-stato').parentNode.classList.add('fine');
    $('#ch-umano').disabled = true; $('#ch-avanti').hidden = true;
    if (cap.nome && !st.fatta) { st.fatta = true; mem.set('stato', st); }
  }
  function chiamata() {
    clearInterval(tick); passo = 0; sec = 0; cap = {};
    $('#ch-trasc').innerHTML = ''; $('#ch-stato').textContent = 'Chiamata in corso'; $('#ch-stato').parentNode.classList.remove('fine'); $('#ch-umano').disabled = false; $('#ch-tempo').textContent = '00:00';
    onda(true); disegnaCapito();
    $('#ch-avanti').hidden = !ridotto();
    if (ridotto()) { while (passo < 8) avanza(); return; }
    avanza(); tick = setInterval(avanza, 2200);
  }
  function umano() {
    clearInterval(tick); var t = $('#ch-trasc'), s = t.querySelector('.scrivendo'); if (s) s.remove();
    t.insertAdjacentHTML('beforeend', riga(['pz', 'Posso parlare con qualcuno della segreteria?']) + riga(['ai', 'Certo, la passo subito alla segreteria. Resti in linea, per favore.']) + riga(['sis', 'Trasferita a Sara, segreteria · le note della chiamata sono già sul suo schermo']));
    cap.umano = 1; disegnaCapito(); fine();
  }
  function tutte() { var l = CH.slice(); if (st.fatta) l.unshift({ id: 'live', ora: '11:00', chi: '+39 347 ••• •• 18', es: 'app', dur: '1:52', t: 'Prima valutazione per mal di schiena', r: ['Nuova paziente: Paola Ferretti', 'Prenotata ' + GG[dGio.getDay()] + ' ' + dGio.getDate() + ' alle 15:30 con la dott.ssa Neri', 'SMS di conferma inviato'], tr: COPIONE.filter(function (x) { return x[0] !== 'sis'; }).map(function (x) { return [x[0], x[1]]; }) }); return l; }
  function chiamate() {
    var l = tutte(), n = function (e) { return l.filter(function (c) { return c.es === e; }).length; };
    $('#cs-kpi').innerHTML = '<div><b>' + l.length + '</b><small>chiamate da stamattina</small></div><div class="m"><b>' + n('app') + '</b><small>appuntamenti presi o spostati</small></div><div class="a"><b>' + n('ric') + '</b><small>da richiamare</small></div>';
    $('#cs-filtri').innerHTML = FIL.map(function (f) { return '<button type="button" data-fil="' + f[0] + '" aria-pressed="' + (f[0] === fil) + '">' + f[1] + '</button>'; }).join('');
    $('#cs-lista').innerHTML = l.filter(function (c) { return fil === 'tutte' || c.es === fil; }).map(function (c) { return '<li><a href="#/dettaglio/' + c.id + '"><b>' + c.t + '</b><span class="esito e-' + c.es + '">' + ES[c.es] + '</span><small>' + c.ora + ' · ' + c.chi + ' · ' + c.dur + '</small><p>' + c.r[c.r.length - 1] + '</p></a></li>'; }).join('');
  }
  function dettaglio(id) {
    var c = tutte().filter(function (x) { return x.id === id; })[0] || CH[0];
    $('#d-box').innerHTML = '<span class="esito e-' + c.es + '">' + ES[c.es] + '</span><h1 id="d-tit">' + c.t + '</h1><p style="margin:0;color:var(--grigio);font-size:14px">Oggi alle ' + c.ora + ' · ' + c.chi + ' · durata ' + c.dur + '</p>' +
      '<div class="riass"><b>Riassunto per la segreteria</b><ul>' + c.r.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul></div><p class="sec">Trascrizione</p><ol class="trasc">' + c.tr.map(riga).join('') + '</ol>' +
      (c.es === 'ric' ? '<button class="btn" type="button" style="width:100%;margin-top:16px" id="d-ric">Segna come richiamato</button>' : '');
  }
  function agenda() {
    var g = '', k = 0, n = 0;
    while (n < 6) { k++; var d = giorno(k); if (d.getDay() === 0) continue; g += '<button type="button" data-ag="' + k + '" aria-pressed="' + (k === agG) + '"><small>' + GG[d.getDay()].slice(0, 3) + '</small><b>' + d.getDate() + '</b></button>'; n++; }
    $('#ag-giorni').innerHTML = g;
    var l = AG.filter(function (a) { return a[0] === agG; });
    if (st.fatta && agG === kGio) l = l.concat([[kGio, '15:30', 'Paola Ferretti', 'Prima valutazione schiena · dott.ssa Neri, sala 1', 'ai', 1]]);
    l.sort(function (a, b) { return parseFloat(a[1].replace(':', '.')) - parseFloat(b[1].replace(':', '.')); });
    $('#ag-lista').innerHTML = l.length ? l.map(function (a) { return '<li' + (a[5] ? ' class="nuovo"' : '') + '><span class="ora">' + a[1] + '</span><span><b>' + a[2] + '</b><small>' + a[3] + '</small><span class="da' + (a[4] === 'seg' ? ' seg">preso dalla segreteria' : '">preso dall\'assistente' + (a[5] ? ' · appena ora' : '')) + '</span></span></li>'; }).join('') : '<li><span class="vuoto">Nessun appuntamento preso per telefono in questo giorno.</span></li>';
  }
  function regole() {
    $('#re-frase').innerHTML = APERTURA;
    $('#re-lista').innerHTML = REG.map(function (r) { var on = r[4] ? true : (st.reg[r[0]] !== undefined ? st.reg[r[0]] : !!r[3]); return '<li><span><b>' + r[1] + '</b><small>' + r[2] + (r[4] ? ' · sempre attivo' : '') + '</small></span><button class="sw" type="button" role="switch" data-reg="' + r[0] + '" aria-checked="' + on + '" aria-label="' + r[1] + '"' + (r[4] ? ' disabled' : '') + '></button></li>'; }).join('');
    $('#re-sa').innerHTML = [['Orari', 'lun–ven 8:30–19:30, sabato 9–13'], ['Servizi e prezzi', 'prima valutazione 60 €, seduta 45 €, tecar 35 €, pacchetto 10 sedute 400 €'], ['Terapisti', 'dott.ssa Neri (pavimento pelvico, linfodrenaggio), dott. Sala (sport, ortopedia)'], ['Indirizzo', 'via dei Platani 14, parcheggio nel cortile']].map(function (s) { return '<li><b>' + s[0] + '</b><span>' + s[1] + '</span></li>'; }).join('');
  }
  var R = { chiamata: chiamata, chiamate: chiamate, dettaglio: dettaglio, agenda: agenda, regole: regole };
  function route() {
    var p = location.hash.replace(/^#\/?/, '').split('/'), n = R[p[0]] ? p[0] : 'chiamata';
    if (n !== 'chiamata') { clearInterval(tick); tick = null; }
    $$('[data-screen]').forEach(function (s) { s.hidden = s.dataset.screen !== n; });
    var tab = n === 'dettaglio' ? 'chiamate' : n;
    $$('.tabbar a').forEach(function (a) { if (a.dataset.tab === tab) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    R[n](p[1]); window.scrollTo(0, 0); var sc = $('.app > main'); if (sc) sc.scrollTop = 0;
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b || b.disabled) return;
    if (b.id === 'ch-umano') umano();
    else if (b.id === 'ch-avanti') { avanza(); if (cap.fine) b.hidden = true; }
    else if (b.id === 'ch-rifai') chiamata();
    else if (b.dataset.fil) { fil = b.dataset.fil; chiamate(); }
    else if (b.dataset.ag) { agG = +b.dataset.ag; agenda(); }
    else if (b.dataset.reg) { var on = b.getAttribute('aria-checked') !== 'true'; st.reg[b.dataset.reg] = on; mem.set('stato', st); b.setAttribute('aria-checked', on); }
    else if (b.id === 'd-ric') { b.textContent = 'Segnato: richiamato alle ' + new Date().getHours() + ':' + ('0' + new Date().getMinutes()).slice(-2); b.disabled = true; }
  });
  window.addEventListener('hashchange', route);
  route();
})();
