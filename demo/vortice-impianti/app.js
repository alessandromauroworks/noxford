/* Vortice Impianti - app dimostrativa. Nessun dato viene inviato: richieste e foto restano in questo browser. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var mem = {
    get: function (k, d) { try { var v = localStorage.getItem('vortice-' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('vortice-' + k, JSON.stringify(v)); } catch (e) {} }
  };
  var I = {
    acqua: '<path d="M12 3c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11z" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    scarico: '<path d="M4 6h16l-3 6H7zM12 12v8M9 20h6" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    caldaia: '<rect x="6" y="3" width="12" height="15" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M10 13c0-2 2-2 2-4 0 2 2 2 2 4a2 2 0 0 1-4 0z" fill="currentColor"/>',
    clima: '<rect x="3" y="5" width="18" height="7" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M7 16v3M12 16v4M17 16v3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    rubinetto: '<path d="M4 10h9a3 3 0 0 1 3 3v2M8 10V6h4M16 18v2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    boiler: '<rect x="7" y="3" width="10" height="17" rx="5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M10 21v-1M14 21v-1M12 9v5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>'
  };
  var SERV = [
    { id: 'rubinetto', c: 'idraulica', ic: 'rubinetto', n: 'Perdita dal rubinetto', s: 'gocciola o non chiude', min: 60, max: 110, mano: '30–60 minuti', mat: 'cartuccia o guarnizioni', img: 'img/lavello.webp', alt: 'Sotto un lavello: sifone smontato, chiave inglese, nastro di teflon e un secchio', top: 1, come: ['Chiudiamo l\'acqua e smontiamo il rubinetto', 'Cambiamo cartuccia o guarnizioni', 'Se è troppo vecchio ti proponiamo il cambio, con il prezzo prima', 'Proviamo acqua calda e fredda davanti a te'] },
    { id: 'scarico', c: 'idraulica', ic: 'scarico', n: 'Scarico intasato', s: 'lavandino, doccia o wc', min: 70, max: 140, mano: '30–60 minuti', mat: 'di solito nessuno', top: 1, come: ['Capiamo dove si ferma l\'acqua', 'Sonda a molla o pompa, senza prodotti aggressivi', 'Pulizia del sifone', 'Prova con acqua a pieno flusso'] },
    { id: 'caldaia', c: 'caldaia', ic: 'caldaia', n: 'Caldaia in blocco', s: 'non parte, poca pressione', min: 90, max: 220, mano: '1–2 ore', mat: 'dipende dal pezzo', img: 'img/caldaia.webp', alt: 'Caldaia bianca a parete con tubi di rame e una cassetta degli attrezzi', top: 1, come: ['Leggiamo il codice di errore', 'Controllo di pressione, sonde e scheda', 'Se serve un pezzo te lo diciamo con il prezzo', 'Riaccensione e prova dei termosifoni'] },
    { id: 'boiler', c: 'caldaia', ic: 'boiler', n: 'Sostituzione scaldabagno', s: 'elettrico da 80 litri, posa compresa', min: 290, max: 420, mano: '2–3 ore', mat: 'scaldabagno nuovo compreso', top: 1, come: ['Sopralluogo con foto per vedere spazio e attacchi', 'Smontiamo e portiamo via il vecchio', 'Montiamo il nuovo con valvola di sicurezza', 'Primo riempimento e prova'] },
    { id: 'clima', c: 'clima', ic: 'clima', n: 'Manutenzione condizionatore', s: 'pulizia filtri e igienizzazione, per split', min: 60, max: 80, mano: '45 minuti a split', mat: 'prodotto igienizzante', top: 1, come: ['Pulizia dei filtri e della batteria interna', 'Igienizzazione contro i cattivi odori', 'Controllo dello scarico della condensa', 'Prova di raffreddamento e caldo'] },
    { id: 'gas', c: 'clima', ic: 'clima', n: 'Ricarica gas condizionatore', s: 'non raffredda più', min: 90, max: 160, mano: '1 ora circa', mat: 'gas refrigerante', come: ['Cerchiamo prima la perdita', 'Ripariamo il punto che perde', 'Ricarica con la quantità giusta', 'Misura della temperatura in uscita'] },
    { id: 'perdita', c: 'idraulica', ic: 'acqua', n: 'Perdita d\'acqua nel muro', s: 'macchie, bollette alte', min: 120, max: 300, mano: 'mezza giornata', mat: 'raccordi e tubo', come: ['Ricerca della perdita senza rompere a caso', 'Apertura minima del muro', 'Riparazione del tubo', 'Chiusura con malta, la pittura è a parte'] }
  ];
  var CAT = [['tutti', 'Tutti'], ['idraulica', 'Idraulica'], ['caldaia', 'Caldaie e boiler'], ['clima', 'Clima']];
  var FASCE = [['dm', 'Domani mattina', '8:00–12:00', 0], ['dp', 'Domani pomeriggio', '14:00–18:00', 0], ['ds', 'Domani sera', '18:00–20:00', 20], ['gg', 'Giovedì', 'tutto il giorno', 0]];
  var UR = [['allaga', 'Sta allagando', 'chiudiamo e ripariamo la perdita'], ['freddo', 'Niente riscaldamento', 'caldaia in blocco o spenta'], ['wc', 'WC o scarico bloccato', 'non si può usare il bagno']];
  var PIANI = [
    { id: 'base', n: 'Base', p: 89, s: 'Controllo annuale, analisi dei fumi e bollino.' },
    { id: 'sereno', n: 'Sereno', p: 149, s: 'In più: uscite urgenti senza diritto di chiamata e 15% di sconto sui pezzi.', cons: 1 },
    { id: 'tutto', n: 'Tutto compreso', p: 229, s: 'In più: pezzi di ricambio fino a 200 € l\'anno e priorità il giorno stesso.' }
  ];
  var STORICO = [{ n: 'Sostituzione rubinetto cucina', d: '14 ott', t: 'Luca', e: '95 €', p: 'Miscelatore nuovo, garanzia 2 anni.' }, { n: 'Pulizia 2 split', d: '12 giu', t: 'Sara', e: '120 €', p: 'Filtri lavati, igienizzazione fatta.' }, { n: 'Vaso di espansione caldaia', d: '3 feb', t: 'Luca', e: '140 €', p: 'Pressione tornata stabile a 1,4 bar.' }];
  var st = mem.get('stato', { int: null, piano: null, fatti: [] });
  var req = { tipo: 'rubinetto', dove: 'Cucina', desc: '', foto: null, fascia: 'dm' };
  var urg = 'allaga', cat = 'tutti', timer = null;
  var salva = function () { mem.set('stato', st); };
  var serv = function (id) { return SERV.filter(function (t) { return t.id === id; })[0]; };
  var ic = function (k) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + I[k] + '</svg>'; };
  var riga = function (s) { return '<li><a href="#/servizio/' + s.id + '"><span class="ic">' + ic(s.ic) + '</span><span><b>' + s.n + '</b><small>' + s.s + '</small></span><span class="pr">' + s.min + '–' + s.max + ' €<small>indicativo</small></span></a></li>'; };
  var storicoTutto = function () { return (st.fatti || []).concat(STORICO); };

  function home() {
    $('#home-serv').innerHTML = SERV.filter(function (s) { return s.top; }).map(riga).join('');
    var p = st.piano && PIANI.filter(function (x) { return x.id === st.piano; })[0];
    $('#home-contr').innerHTML = p ? '<span><b>Contratto ' + p.n + ' attivo</b><small>Il controllo della caldaia lo fissiamo noi e ti avvisiamo prima.</small></span><a href="#/caldaia">Vedi</a>'
      : '<span><b>Controllo caldaia in scadenza</b><small>Il bollino scade domani. Con un contratto ci pensiamo noi ogni anno.</small></span><a href="#/caldaia">Scegli</a>';
    $('#home-sto').innerHTML = storicoTutto().slice(0, 2).map(function (s) { return '<li><b>' + s.n + '</b><small>' + s.d + ' · ' + s.t + ' · ' + s.e + '</small></li>'; }).join('');
  }
  function servizi() {
    $('#se-cat').innerHTML = CAT.map(function (c) { return '<button type="button" data-cat="' + c[0] + '" aria-pressed="' + (c[0] === cat) + '">' + c[1] + '</button>'; }).join('');
    $('#se-lista').innerHTML = SERV.filter(function (s) { return cat === 'tutti' || s.c === cat; }).map(riga).join('');
  }
  function servizio(id) {
    var s = serv(id) || SERV[0];
    $('#sv-box').innerHTML = '<div class="sv-top"><span class="ic">' + ic(s.ic) + '</span><h1 id="sv-nome">' + s.n + '</h1></div>' + (s.img ? '<img class="sv-img" src="' + s.img + '" alt="' + s.alt + '" width="800" height="600">' : '') +
      '<div class="range" style="margin-top:14px"><small>Prezzo indicativo, uscita compresa</small><b>' + s.min + '–' + s.max + ' €</b><small>Durata: ' + s.mano + ' · materiale: ' + s.mat + '</small></div>' +
      '<h2 class="sec">Cosa facciamo</h2><ol class="come">' + s.come.map(function (c) { return '<li>' + c + '</li>'; }).join('') + '</ol>' +
      '<p class="info">Con una foto il tecnico capisce prima e arriva con il pezzo giusto.</p><a class="btn full" href="#/problema/' + s.id + '">Prenota con una foto</a><a class="btn chiaro full" href="#/urgente">È urgente</a>';
  }
  function problema(id) {
    if (id && serv(id)) req.tipo = id;
    $('#pb-tipo').innerHTML = SERV.map(function (t) { return '<button type="button" data-tipo="' + t.id + '" aria-pressed="' + (t.id === req.tipo) + '">' + t.n + '</button>'; }).join('');
    $('#pb-dove').value = req.dove; $('#pb-desc').value = req.desc;
    disegnaFoto();
    $('#pb-fasce').innerHTML = FASCE.map(function (f) { return '<button type="button" data-fascia="' + f[0] + '" aria-pressed="' + (f[0] === req.fascia) + '">' + f[1] + '<small>' + f[2] + (f[3] ? ' · +' + f[3] + ' €' : '') + '</small></button>'; }).join('');
    $('#pb-err').textContent = '';
  }
  function disegnaFoto() {
    $('#pb-foto').innerHTML = req.foto ? '<div class="ant"><img src="' + req.foto + '" alt="Foto del problema scelta da te" width="800" height="600"><span>Foto pronta per il tecnico</span><button type="button" data-togli>Togli</button></div>'
      : '<label for="pb-file">Scatta o scegli una foto<input id="pb-file" type="file" accept="image/*"></label><button type="button" data-esempio>Usa una foto di esempio</button>';
    var f = $('#pb-file');
    if (f) f.addEventListener('change', function () { if (this.files && this.files[0]) { req.foto = URL.createObjectURL(this.files[0]); disegnaFoto(); } });
  }
  function conto() { var t = serv(req.tipo), f = FASCE.filter(function (x) { return x[0] === req.fascia; })[0]; return { t: t, f: f, min: t.min + f[3], max: t.max + f[3] }; }
  function preventivo() {
    var c = conto();
    $('#pv-box').innerHTML = '<div class="range"><small>' + c.t.n + ' · ' + req.dove.toLowerCase() + '</small><b>' + c.min + '–' + c.max + ' €</b><small>IVA inclusa, il prezzo finale lo conferma il tecnico prima di iniziare</small></div>' +
      '<ul class="voci"><li><span>Uscita e diagnosi</span><span>compresa</span></li><li><span>Manodopera stimata</span><span>' + c.t.mano + '</span></li><li><span>Materiale</span><span>' + c.t.mat + '</span></li>' + (c.f[3] ? '<li><span>Fascia serale</span><span>+' + c.f[3] + ' €</span></li>' : '') + '<li><span>Quando</span><span>' + c.f[1] + ', ' + c.f[2] + '</span></li></ul>' +
      '<p class="info">' + (req.foto ? 'Con la foto il tecnico arriva con il pezzo giusto: di solito si risolve in una sola uscita.' : 'Senza foto la stima è più larga. Puoi aggiungerla anche adesso.') + (st.piano === 'sereno' || st.piano === 'tutto' ? ' Con il tuo contratto i pezzi sono scontati.' : '') + '</p>' +
      '<button class="btn full" type="button" id="pv-ok">Conferma la richiesta (demo)</button><p class="nota">Demo: non inviamo nulla. Nella versione vera la richiesta arriva al nostro ufficio con la foto e ti richiamiamo per confermare l\'orario.</p>';
  }
  function urgente() {
    clearInterval(timer);
    var box = $('#ur-box');
    if (!st.int) {
      box.innerHTML = '<h1 class="title" id="h-ur">Intervento urgente</h1><p class="sub">Un tecnico entro 2 ore, dalle 7 alle 22, sabato compreso. Uscita urgente: 60 €, poi il lavoro.</p><div class="tipo-u" role="group" aria-label="Cosa succede">' +
        UR.map(function (u) { return '<button type="button" data-urg="' + u[0] + '" aria-pressed="' + (u[0] === urg) + '"><span>' + u[1] + '<small>' + u[2] + '</small></span></button>'; }).join('') + '</div>' +
        '<div class="ind"><small>Indirizzo salvato</small><b>Via Manzoni 7, scala B, 2° piano</b></div><p class="info">Se perde acqua: chiudi il rubinetto generale, di solito è sotto il lavello o vicino al contatore.</p><button class="btn arancio full" type="button" id="ur-ok">Mandate un tecnico (demo)</button><p class="nota">Demo: nessuna chiamata parte davvero.</p>';
      return;
    }
    var i = st.int, prog = i.tipo !== 'urgente';
    var FA = prog ? [['Richiesta ricevuta', 'con la foto e la descrizione'], ['Orario confermato', i.quando], ['Tecnico in arrivo', 'il giorno stesso ti avvisiamo 30 minuti prima'], ['Lavoro fatto', 'paghi al tecnico, anche con carta']]
      : [['Richiesta ricevuta', 'oggi alle ' + i.ora], ['Tecnico assegnato', 'Luca ha il furgone con i pezzi'], ['In viaggio verso di te', ''], ['Arrivato', 'suona al citofono 2B']];
    box.innerHTML = '<h1 class="title" id="h-ur">' + (prog ? 'Intervento programmato' : 'Il tecnico sta arrivando') + '</h1>' +
      '<div class="eta' + (prog ? ' prog' : '') + '" aria-live="polite"><span><small>' + (prog ? 'Quando' : 'Arrivo stimato') + '</small><b id="ur-eta">' + (prog ? i.quando.split(',')[0] : i.min + ' min') + '</b><small>' + (prog ? (i.quando.split(',')[1] || '') + ' · ' + i.titolo : i.titolo) + '</small></span></div>' +
      '<div class="tec"><span class="av" aria-hidden="true">LB</span><span><b>Luca B.</b><small>Tecnico idraulico e caldaie</small></span><a href="#/urgente" data-chiama>Chiama</a></div>' +
      (prog ? '' : '<div class="mappa"><svg viewBox="0 0 360 180" role="img" aria-label="Mappa stilizzata con il furgone del tecnico che si avvicina"><rect width="360" height="180" fill="#E6ECF3"/><g stroke="#fff" stroke-width="10" fill="none"><path d="M0 60h360M0 130h360M90 0v180M250 0v180"/></g><path id="ur-path" d="M30 130H90V60H250V130H320" fill="none" stroke="#1F5FD1" stroke-width="4" stroke-dasharray="8 6"/><circle cx="320" cy="130" r="12" fill="#FF7A1A"/><path d="M314 130l6-6 6 6v6h-12z" fill="#fff"/><g class="furgone" id="ur-van"><rect x="-13" y="-8" width="26" height="16" rx="3" fill="#0E2A47"/><circle cx="-7" cy="9" r="3" fill="#0E2A47"/><circle cx="7" cy="9" r="3" fill="#0E2A47"/></g></svg></div>') +
      '<ol class="fasi-u" id="ur-fasi">' + FA.map(function (f) { return '<li><b>' + f[0] + '</b><small>' + f[1] + '</small></li>'; }).join('') + '</ol>' +
      (!prog && i.min <= 0 ? '<button class="btn full" type="button" id="ur-fine">Lavoro finito: aggiungi allo storico</button>' : '') +
      '<button class="btn chiaro full" type="button" id="ur-annulla">Annulla la richiesta</button>' + (prog ? '' : '<p class="nota">Demo: il tempo scorre più veloce del vero, un minuto ogni due secondi.</p>');
    aggiorna();
    if (!prog && i.min > 0) timer = setInterval(function () { if (!st.int || st.int.min <= 0) { clearInterval(timer); urgente(); return; } st.int.min--; salva(); aggiorna(); }, 2000);
  }
  function aggiorna() {
    var i = st.int; if (!i) return;
    var prog = i.tipo !== 'urgente', fase = prog ? 1 : (i.min <= 0 ? 3 : 2);
    $$('#ur-fasi li').forEach(function (li, k) { li.className = k < fase ? 'ok' : k === fase ? 'ora' : ''; });
    if (prog) return;
    var e = $('#ur-eta'); if (e) e.textContent = i.min > 0 ? i.min + ' min' : 'arrivato';
    var p = $('#ur-path'), v = $('#ur-van');
    if (p && v && p.getTotalLength) { var L = p.getTotalLength(), pt = p.getPointAtLength(L * Math.min(1, (25 - i.min) / 25)); v.setAttribute('transform', 'translate(' + pt.x + ' ' + (pt.y - 2) + ')'); }
    var f2 = $$('#ur-fasi li')[2]; if (f2) f2.querySelector('small').textContent = i.min > 0 ? 'mancano circa ' + i.min + ' minuti' : 'è arrivato';
  }
  function storico() {
    var att = st.int ? '<li><b>' + st.int.titolo + '</b><span class="stato in">' + (st.int.tipo === 'urgente' ? 'in corso' : 'programmato') + '</span><p>' + (st.int.tipo === 'urgente' ? 'Tecnico in arrivo' : st.int.quando) + '</p></li>' : '';
    $('#st-lista').innerHTML = att + storicoTutto().map(function (s) { return '<li><b>' + s.n + '</b><span class="stato">fatto</span><p>' + s.d + ' · ' + s.t + ' · ' + s.e + '. ' + s.p + '</p></li>'; }).join('');
  }
  function caldaia() {
    var oggi = new Date(); oggi.setHours(12, 0, 0, 0);
    var sc = new Date(oggi.getFullYear(), 10, 18, 12); if (sc < oggi) sc.setFullYear(sc.getFullYear() + 1);
    var gg = Math.round((sc - oggi) / 864e5);
    $('#cd-boll').className = 'bollino ' + (st.piano ? 'ok' : 'scade');
    $('#cd-boll').textContent = st.piano ? 'Controllo fissato da noi: ti chiamiamo per l\'orario' : (gg <= 1 ? 'Il bollino scade domani' : 'Il bollino scade tra ' + gg + ' giorni');
    var cur = st.sel || st.piano || 'sereno';
    $('#cd-piani').innerHTML = PIANI.map(function (p) { return '<button type="button" data-piano="' + p.id + '" aria-pressed="' + (p.id === cur) + '"><span>' + (p.cons ? '<span class="cons">Il più scelto</span><br>' : '') + '<b>' + p.n + '</b></span><span class="pr">' + p.p + ' €/anno</span><small>' + p.s + '</small></button>'; }).join('');
    var s = PIANI.filter(function (p) { return p.id === cur; })[0];
    $('#cd-riep').innerHTML = st.piano === s.id ? '<p><b>Contratto ' + s.n + ' attivo.</b></p><p>Il prossimo controllo lo fissiamo noi e ti mandiamo un messaggio una settimana prima.</p>'
      : '<p><b>' + s.n + ': ' + s.p + ' € l\'anno</b>, si paga al primo controllo. Si disdice quando vuoi prima del rinnovo.</p><button class="btn" type="button" id="cd-ok">Attiva il contratto (demo)</button>';
  }
  var R = { home: home, servizi: servizi, servizio: servizio, problema: problema, preventivo: preventivo, urgente: urgente, storico: storico, caldaia: caldaia };
  var TAB = { servizio: 'servizi', problema: 'servizi', preventivo: 'servizi', caldaia: 'storico' };
  function route() {
    var p = location.hash.replace(/^#\/?/, '').split('/'), n = R[p[0]] ? p[0] : 'home';
    if (n !== 'urgente') clearInterval(timer);
    $$('[data-screen]').forEach(function (s) { s.hidden = s.dataset.screen !== n; });
    var tab = TAB[n] || n;
    $$('.tabbar a').forEach(function (a) { if (a.dataset.tab === tab) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    R[n](p[1]); window.scrollTo(0, 0); var sc = $('.app > main'); if (sc) sc.scrollTop = 0;
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('button, a[data-chiama]'); if (!b) return;
    if (b.dataset.cat) { cat = b.dataset.cat; servizi(); }
    else if (b.dataset.tipo) { req.tipo = b.dataset.tipo; $$('[data-tipo]').forEach(function (x) { x.setAttribute('aria-pressed', x.dataset.tipo === req.tipo); }); }
    else if (b.dataset.fascia) { req.fascia = b.dataset.fascia; $$('[data-fascia]').forEach(function (x) { x.setAttribute('aria-pressed', x.dataset.fascia === req.fascia); }); }
    else if (b.hasAttribute('data-esempio')) { req.foto = 'img/lavello.webp'; disegnaFoto(); $('#pb-err').textContent = ''; }
    else if (b.hasAttribute('data-togli')) { req.foto = null; disegnaFoto(); }
    else if (b.id === 'pb-vai') {
      req.dove = $('#pb-dove').value; req.desc = $('#pb-desc').value.trim();
      if (req.desc.length < 8 && !req.foto) { $('#pb-err').textContent = 'Scrivi due parole o aggiungi una foto: al tecnico serve capire cosa portare.'; return; }
      location.hash = '#/preventivo';
    }
    else if (b.id === 'pv-ok') { var c = conto(); st.int = { tipo: 'prog', quando: c.f[1] + ', ' + c.f[2], titolo: c.t.n }; salva(); location.hash = '#/urgente'; }
    else if (b.dataset.urg) { urg = b.dataset.urg; $$('[data-urg]').forEach(function (x) { x.setAttribute('aria-pressed', x.dataset.urg === urg); }); }
    else if (b.id === 'ur-ok') { var d = new Date(); st.int = { tipo: 'urgente', min: 25, ora: d.getHours() + ':' + ('0' + d.getMinutes()).slice(-2), titolo: UR.filter(function (u) { return u[0] === urg; })[0][1] }; salva(); urgente(); }
    else if (b.id === 'ur-fine') { st.fatti = st.fatti || []; st.fatti.unshift({ n: 'Intervento urgente: ' + st.int.titolo.toLowerCase(), d: 'oggi', t: 'Luca', e: 'da 60 €', p: 'Ricevuta inviata per email nella versione vera.' }); st.int = null; salva(); location.hash = '#/storico'; }
    else if (b.id === 'ur-annulla') { st.int = null; salva(); urgente(); }
    else if (b.hasAttribute('data-chiama')) { e.preventDefault(); b.textContent = 'Demo: nessuna chiamata'; }
    else if (b.dataset.piano) { st.sel = b.dataset.piano; caldaia(); }
    else if (b.id === 'cd-ok') { st.piano = st.sel || 'sereno'; salva(); caldaia(); }
  });
  window.addEventListener('hashchange', route);
  route();
})();
