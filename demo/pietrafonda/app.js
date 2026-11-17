/* Pietrafonda Costruzioni - app dimostrativa. Nessun dato viene inviato: scelte e firme restano nel browser.
   La vista cliente e la vista impresa leggono lo stesso stato, cosi si vede come il gestionale e l'app parlano tra loro. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var mem = {
    get: function (k, d) { try { var v = localStorage.getItem('pietrafonda-' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('pietrafonda-' + k, JSON.stringify(v)); } catch (e) {} }
  };
  var FASI = [['Demolizioni e smaltimento', '6–10 ott'], ['Impianto elettrico', '13–24 ott'], ['Impianto idraulico', '20–31 ott'], ['Massetti', '3–7 nov'], ['Bagno: piastrelle e sanitari', '10–21 nov'], ['Pavimenti in parquet', '24 nov–2 dic'], ['Tinteggiatura', '3–9 dic'], ['Pulizia e consegna chiavi', '12 dic']];
  var PROSSIMI = ['Domani: inizio impianto elettrico, servono le chiavi della cantina.', 'Giovedì: passaggio dei tubi in cucina.', 'Lunedì: getto dei massetti, non si cammina per 48 ore.', 'Giovedì: posa delle piastrelle in bagno. Scegli entro mercoledì la variante del piatto doccia.', 'Lunedì 24: arriva il parquet. Libera il corridoio dagli scatoloni.', 'Mercoledì 3: si parte con le pitture, colori già scelti.', 'Venerdì 12: consegna delle chiavi alle 10.', 'Lavori finiti. Ti mandiamo le dichiarazioni di conformità.'];
  var FOTO = [
    { d: 'oggi · 17:20', t: 'Bagno: metà delle piastrelle posate', p: 'Parete della doccia finita, domani nicchia e pavimento. Colore delle fughe: grigio cemento, come da campione.', img: 'img/bagno.webp', alt: 'Bagno in ristrutturazione con piastrelle grigie posate a metà, distanziatori arancioni, secchio e spatola dentata' },
    { d: 'ven 7 nov · 16:45', t: 'Massetti asciutti, misurata l\'umidità', p: 'Valore sotto il 2%: si può posare il parquet nei tempi previsti.' },
    { d: 'mer 29 ott · 18:05', t: 'Tracce e scatole elettriche in soggiorno', p: 'Quattro prese in più rispetto al progetto, come chiesto in sopralluogo. Le tracce si chiudono lunedì.', img: 'img/interno.webp', alt: 'Stanza con muri grezzi, tracce per i cavi elettrici, sacchi di malta e una scala' },
    { d: 'ven 10 ott · 15:30', t: 'Demolizioni finite', p: 'Portati via 3 cassoni di macerie. Trovata una trave in buone condizioni: la lasciamo a vista.' }
  ];
  var DOCS = [
    { id: 'contratto', c: 'contratti', n: 'Contratto d\'appalto firmato', d: '22 set', k: 'PDF · 6 pagine', ok: 1, righe: [['Lavori', 'Ristrutturazione completa'], ['Importo a corpo', '68.400 €'], ['Durata', '10 settimane'], ['Penale ritardo', '50 € al giorno']] },
    { id: 'cila', c: 'permessi', n: 'CILA protocollata in Comune', d: '29 set', k: 'PDF · 3 pagine', ok: 1, righe: [['Pratica', 'CILA n. 418/2026 (esempio)'], ['Tecnico', 'Geom. Marco R.'], ['Esito', 'Protocollata']] },
    { id: 'sal1', c: 'sal', n: 'SAL 1 · avanzamento al 31 ottobre', d: '3 nov', k: 'PDF · 2 pagine', ok: 1, righe: [['Lavori eseguiti', '27.360 €'], ['Già fatturato', '0 €'], ['Da pagare', '27.360 €'], ['Stato', 'Pagato il 10 nov']] },
    { id: 'sal2', c: 'sal', n: 'SAL 2 · avanzamento al 15 novembre', d: 'oggi', k: 'PDF · 2 pagine', firma: 1, righe: [['Lavori eseguiti', '41.040 €'], ['Già fatturato', '27.360 €'], ['Da pagare', '13.680 €'], ['Scadenza', 'entro 15 giorni']] },
    { id: 'piastrelle', c: 'schede', n: 'Scheda piastrelle bagno 60×120', d: '30 ott', k: 'PDF · 1 pagina', ok: 1, righe: [['Formato', '60×120 cm'], ['Finitura', 'effetto pietra grigia'], ['Fuga', '2 mm grigio cemento']] }
  ];
  var CAT = [['tutti', 'Tutti'], ['contratti', 'Contratti'], ['permessi', 'Permessi'], ['sal', 'SAL e pagamenti'], ['schede', 'Schede tecniche']];
  var VAR = [
    { id: 'doccia', n: 'Piatto doccia più grande', p: 'Da 90×70 a 120×80 cm, con canalina a filo pavimento.', e: 380 },
    { id: 'usb', n: 'Quattro prese con USB in cucina', p: 'Sopra il piano di lavoro, al posto delle prese normali.', e: 160 },
    { id: 'porta', n: 'Porta scorrevole nel muro del bagno', p: 'Controtelaio a scomparsa: si guadagna spazio vicino al lavandino.', e: 620 }
  ];
  var BASE = 68400;
  var st = mem.get('stato', { fase: 4, var: {}, firmati: [], log: [] });
  var docF = 'tutti';
  var mod = mem.get('moduli', ['cantieri', 'foto', 'documenti', 'sal']);
  var MOD = [['cantieri', 'Cantieri e fasi', 'avanzamento, date'], ['foto', 'Diario foto', 'dal telefono del capocantiere'], ['documenti', 'Documenti', 'contratti, permessi'], ['sal', 'SAL e pagamenti', 'acconti e scadenze'], ['varianti', 'Varianti', 'il cliente approva da app'], ['squadre', 'Squadre e mezzi', 'chi va dove domani'], ['magazzino', 'Magazzino', 'materiali e ordini'], ['fornitori', 'Fornitori', 'preventivi a confronto'], ['ore', 'Ore e presenze', 'dal telefono degli operai'], ['margini', 'Margini per cantiere', 'previsto contro reale']];
  var salva = function () { mem.set('stato', st); };
  var euro = function (n) { return n.toLocaleString('it-IT') + ' €'; };
  var ora = function () { var d = new Date(); return d.getHours() + ':' + ('0' + d.getMinutes()).slice(-2); };
  var perc = function () { return Math.round((st.fase + 0.6) / FASI.length * 100); };
  var IC = {
    cantiere: '<path d="M3 20h18M6 20V11h12v9M9 11V6h6v5" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    foto: '<rect x="3" y="6" width="18" height="14" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="13" r="3.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 6l2-3h4l2 3" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    documenti: '<path d="M6 3h9l4 4v14H6z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M9 12h7M9 16h7" stroke="currentColor" stroke-width="1.8"/>',
    varianti: '<path d="M5 12l4 4 10-10" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    gestione: '<rect x="3" y="4" width="18" height="16" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3 9h18M9 9v11" stroke="currentColor" stroke-width="1.8"/>',
    sumisura: '<path d="M4 20l6-6M14 4l6 6-8 8-6-6z" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    cliente: '<circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M4 21c1-5 15-5 16 0" fill="none" stroke="currentColor" stroke-width="1.8"/>'
  };
  var TAB_C = [['cantiere', 'Cantiere'], ['foto', 'Foto'], ['documenti', 'Documenti'], ['varianti', 'Varianti']];
  var TAB_I = [['gestione', 'Cantieri'], ['sumisura', 'Come si crea'], ['cantiere', 'App cliente', 'cliente']];
  var inAttesa = function () { return VAR.filter(function (v) { return !st.var[v.id]; }).length + (st.firmati.indexOf('sal2') < 0 ? 1 : 0); };
  var log = function (t) { st.log.unshift({ t: t, h: ora() }); st.log = st.log.slice(0, 6); salva(); };

  function cantiere() {
    var p = perc();
    $('#ca-avanz').innerHTML = '<div class="n"><b>' + p + '%</b><span>fase ' + (st.fase + 1) + ' di ' + FASI.length + '<br>consegna prevista 12 dic</span></div><div class="barra" role="progressbar" aria-valuenow="' + p + '" aria-valuemin="0" aria-valuemax="100" aria-label="Avanzamento lavori"><i style="width:' + p + '%"></i></div><small>In linea con il programma. Ultimo aggiornamento del capocantiere: oggi alle 17:20.</small>';
    var n = inAttesa();
    $('#ca-pross').innerHTML = '<b>Prossimo passo</b><span>' + PROSSIMI[st.fase] + '</span>' + (n ? '<p style="margin:8px 0 0"><a href="#/varianti">Hai ' + n + (n === 1 ? ' cosa' : ' cose') + ' da decidere</a></p>' : '');
    $('#ca-fasi').innerHTML = FASI.map(function (f, i) { var c = i < st.fase ? 'fatta' : i === st.fase ? 'corso' : ''; return '<li class="' + c + '"><span class="st" aria-hidden="true">' + (i < st.fase ? '✓' : i === st.fase ? '•' : '') + '</span><b>' + f[0] + '</b><small>' + (i === st.fase ? 'in corso' : f[1]) + '</small></li>'; }).join('');
  }
  function foto() {
    $('#fo-lista').innerHTML = FOTO.map(function (f) {
      return f.img ? '<li><img src="' + f.img + '" alt="' + f.alt + '" width="800" height="600" loading="lazy"><div class="tx"><span class="d">' + f.d + '</span><b>' + f.t + '</b><p>' + f.p + '</p></div></li>'
        : '<li><div class="solo"><span class="ic" aria-hidden="true">i</span><div><span class="d">' + f.d + '</span><b>' + f.t + '</b><p>' + f.p + '</p></div></div></li>';
    }).join('');
  }
  function documenti() {
    $('#do-filtri').innerHTML = CAT.map(function (c) { return '<button type="button" data-df="' + c[0] + '" aria-pressed="' + (c[0] === docF) + '">' + c[1] + '</button>'; }).join('');
    $('#do-lista').innerHTML = DOCS.filter(function (d) { return docF === 'tutti' || d.c === docF; }).map(function (d) {
      var firmato = st.firmati.indexOf(d.id) >= 0;
      return '<li><button type="button" data-doc="' + d.id + '"><span class="ic" aria-hidden="true">PDF</span><span><b>' + d.n + '</b><small>' + d.d + ' · ' + d.k + '</small></span>' + (d.firma ? '<span class="tag ' + (firmato ? 'ok">Visto' : 'da">Da vedere') + '</span>' : '<span class="tag ok">Ok</span>') + '</button></li>';
    }).join('');
    $('#do-sheet').hidden = true;
  }
  function apriDoc(id) {
    var d = DOCS.filter(function (x) { return x.id === id; })[0], firmato = st.firmati.indexOf(id) >= 0, sh = $('#do-sheet');
    sh.innerHTML = '<h2 id="sh-tit">' + d.n + '</h2><small>' + d.d + ' · ' + d.k + '</small><div class="foglio">' + d.righe.map(function (r) { return '<p><span>' + r[0] + '</span><b>' + r[1] + '</b></p>'; }).join('<hr>') + '</div>' +
      '<div class="az">' + (d.firma && !firmato ? '<button class="btn giallo" type="button" data-firma="' + id + '">Ho visto, confermo</button>' : '<span class="btn chiaro" aria-disabled="true">' + (d.firma ? 'Confermato' : 'Archiviato') + '</span>') + '<button class="btn" type="button" data-chiudi>Chiudi</button></div><p class="nota">Anteprima di esempio. Nella versione vera si apre il PDF originale.</p>';
    sh.hidden = false; $('[data-chiudi]', sh).focus();
  }
  function varianti() {
    var extra = VAR.reduce(function (s, v) { return s + (st.var[v.id] === 'si' ? v.e : 0); }, 0);
    $('#va-tot').innerHTML = '<div><small>Contratto</small><b>' + euro(BASE) + '</b></div><div><small>Con le varianti scelte</small><b>' + euro(BASE + extra) + '</b></div>';
    $('#va-lista').innerHTML = VAR.map(function (v) { var s = st.var[v.id]; return '<li class="' + (s || 'attesa') + '"><h3>' + v.n + '</h3><p>' + v.p + '</p><div class="r"><b>+' + euro(v.e) + '</b><div class="bt" role="group" aria-label="Decidi: ' + v.n + '"><button type="button" data-var="' + v.id + '" data-v="si" aria-pressed="' + (s === 'si') + '">Sì</button><button type="button" data-var="' + v.id + '" data-v="no" aria-pressed="' + (s === 'no') + '">No</button></div></div></li>'; }).join('');
  }
  function gestione() {
    var apr = VAR.filter(function (v) { return st.var[v.id] === 'si'; }), extra = apr.reduce(function (s, v) { return s + v.e; }, 0);
    $('#ge-kpi').innerHTML = '<div><b>4</b><small>cantieri aperti</small></div><div><b>' + (st.firmati.indexOf('sal2') < 0 ? 2 : 1) + '</b><small>SAL da chiudere</small></div><div><b>' + VAR.filter(function (v) { return !st.var[v.id]; }).length + '</b><small>varianti in attesa</small></div>';
    var C = [
      { n: 'Via Carducci 18 · Ferri', k: 'ristrutturazione · ' + euro(BASE + extra), p: perc(), m: 18, f: 1 },
      { n: 'Corso Roma 40 · condominio', k: 'facciata e ponteggio · 212.000 €', p: 35, m: 12, img: 'img/facciata.webp' },
      { n: 'Villetta Strada Ponti', k: 'nuovo bagno e tetto · 41.500 €', p: 80, m: -3 },
      { n: 'Negozio via Garibaldi', k: 'cartongesso e impianti · 26.900 €', p: 10, m: 21 }
    ];
    $('#ge-cant').innerHTML = C.map(function (c) {
      return '<li>' + (c.img ? '<img src="' + c.img + '" alt="Facciata di un palazzo coperta dal ponteggio con la rete verde" width="156" height="156" loading="lazy">' : '<span class="ph" aria-hidden="true"></span>') + '<div><b>' + c.n + '</b><small>' + c.k + '</small><div class="mb"><i style="--w:' + c.p + '%"></i>' + c.p + '%</div><div class="marg ' + (c.m >= 0 ? 'ok">Margine previsto ' + c.m + '%' : 'ko">Sotto di ' + (-c.m) + '%: controllare le ore') + '</div>' +
        (c.f ? '<button class="avanti" type="button" data-avanti' + (st.fase >= FASI.length - 1 ? ' disabled' : '') + '>Segna fase finita: ' + FASI[st.fase][0].split(':')[0] + '</button>' : '') + '</div></li>';
    }).join('');
    var ev = st.log.length ? st.log.map(function (l) { return '<li><span>' + l.t + '<small>Famiglia Ferri · via Carducci</small></span><small>' + l.h + '</small></li>'; }).join('') : '';
    $('#ge-ev').innerHTML = ev || '<li><span>Nessuna novità dal cliente.<small>Le varianti approvate e i SAL visti dall\'app compaiono qui.</small></span></li>';
    $('#ge-sq').innerHTML = [['Squadra A · 3 persone', 'Bagno via Carducci', '8:00'], ['Squadra B · 4 persone', 'Ponteggio Corso Roma', '7:30'], ['Elettricista esterno', 'Negozio via Garibaldi', '14:00'], ['Furgone 2 e miniescavatore', 'Fermi in magazzino', '—']].map(function (s) { return '<li><span>' + s[0] + '<small>' + s[1] + '</small></span><span class="p">' + s[2] + '</span></li>'; }).join('');
  }
  function sumisura() {
    var T = [['Ci raccontate come lavorate oggi', 'Una call e un sopralluogo in ufficio: guardiamo fogli, gruppi e file che usate già.', '1 settimana'], ['Disegniamo le schermate', 'Ve le mostriamo cliccabili, come questa demo. Si cambia tutto prima di scrivere il codice.', '1–2 settimane'], ['Lo costruiamo sui vostri dati', 'Importiamo cantieri, clienti e fornitori da Excel. Accessi diversi per ufficio, capocantiere e cliente.', '3–6 settimane'], ['Lo provate su un cantiere vero', 'Un mese di prova con una squadra. Correggiamo quello che non torna.', '4 settimane'], ['Lo usate tutti', 'Formazione di mezza giornata, poi assistenza e piccole modifiche col canone.', 'da lì in poi']];
    $('#su-tappe').innerHTML = T.map(function (t) { return '<li><b>' + t[0] + '</b><span>' + t[1] + '</span><small>' + t[2] + '</small></li>'; }).join('');
    $('#su-mod').innerHTML = MOD.map(function (m) { return '<button type="button" data-mod="' + m[0] + '" aria-pressed="' + (mod.indexOf(m[0]) >= 0) + '">' + m[1] + '<small>' + m[2] + '</small></button>'; }).join('');
    $('#su-sc').textContent = mod.length ? 'Hai scelto ' + mod.length + (mod.length === 1 ? ' pezzo' : ' pezzi') + ': ' + MOD.filter(function (m) { return mod.indexOf(m[0]) >= 0; }).map(function (m) { return m[1].toLowerCase(); }).join(', ') + '.' : 'Scegli almeno un pezzo.';
  }
  var R = { cantiere: cantiere, foto: foto, documenti: documenti, varianti: varianti, gestione: gestione, sumisura: sumisura };
  function tabbar(n) {
    var imp = n === 'gestione' || n === 'sumisura', T = imp ? TAB_I : TAB_C;
    document.querySelector('.app').classList.toggle('impresa', imp);
    var v = $('#vista'); v.textContent = imp ? 'Vista cliente' : 'Vista impresa'; v.setAttribute('href', imp ? '#/cantiere' : '#/gestione');
    $('#tabbar').innerHTML = T.map(function (t) { return '<a href="#/' + t[0] + '"' + (t[0] === n && !t[2] ? ' aria-current="page"' : '') + '><svg viewBox="0 0 24 24" aria-hidden="true">' + IC[t[2] || t[0]] + '</svg>' + t[1] + '</a>'; }).join('');
  }
  function route() {
    var p = location.hash.replace(/^#\/?/, '').split('/'), n = R[p[0]] ? p[0] : 'cantiere';
    $$('[data-screen]').forEach(function (s) { s.hidden = s.dataset.screen !== n; });
    tabbar(n); R[n](p[1]); window.scrollTo(0, 0); var sc = $('.app > main'); if (sc) sc.scrollTop = 0;
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.dataset.df) { docF = b.dataset.df; documenti(); }
    else if (b.dataset.doc) apriDoc(b.dataset.doc);
    else if (b.hasAttribute('data-chiudi')) $('#do-sheet').hidden = true;
    else if (b.dataset.firma) { st.firmati.push(b.dataset.firma); log('Ha visto e confermato il SAL 2'); documenti(); }
    else if (b.dataset.var) { var v = VAR.filter(function (x) { return x.id === b.dataset.var; })[0]; if (st.var[v.id] !== b.dataset.v) { st.var[v.id] = b.dataset.v; log((b.dataset.v === 'si' ? 'Ha approvato: ' : 'Ha rifiutato: ') + v.n.toLowerCase() + (b.dataset.v === 'si' ? ' (+' + euro(v.e) + ')' : '')); } varianti(); }
    else if (b.hasAttribute('data-avanti')) { if (st.fase < FASI.length - 1) { st.fase++; salva(); } gestione(); }
    else if (b.dataset.mod) { var k = mod.indexOf(b.dataset.mod); if (k >= 0) mod.splice(k, 1); else mod.push(b.dataset.mod); mem.set('moduli', mod); sumisura(); }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') $('#do-sheet').hidden = true; });
  window.addEventListener('hashchange', route);
  route();
})();
