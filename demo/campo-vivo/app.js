/* Campo Vivo - app dimostrativa. Nessun dato viene inviato: le prenotazioni restano nel browser. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var euro = function (n) { return (n % 1 ? n.toFixed(2).replace('.', ',') : n) + ' €'; };
  var mem = {
    get: function (k, d) { try { var v = localStorage.getItem('campovivo-' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('campovivo-' + k, JSON.stringify(v)); } catch (e) {} }
  };
  var GG = ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'];
  var giorno = function (k) { var d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + k); return d; };
  var ORE = []; for (var h = 8; h <= 22; h++) ORE.push(h + ':00');
  var CAMPI = ['Campo 1', 'Campo 2', 'Campo 3'];
  var PREZZO = function (ora, dur) { var h = parseInt(ora, 10), base = h >= 18 ? 48 : 36; return dur === 90 ? base * 1.5 : base; };
  var occ = function (k, o, c) { var d = giorno(k).getDate(); return ((d * 5 + o * 7 + c * 11) % 9) < 4 || (o >= 10 && o <= 13 && (d + c) % 3 === 0); };
  var CORSI = [
    { id: 'funz', n: 'Allenamento funzionale', ora: '7:00', min: 45, coach: 'Chiara', ruolo: 'Preparatrice atletica', liv: 'Tutti', posti: 14, pres: 9, g: [1, 3, 5], d: 'Circuito a stazioni con kettlebell, corda e box. Ogni esercizio ha la versione più facile.', port: ['Scarpe da ginnastica pulite', 'Asciugamano', 'Borraccia'] },
    { id: 'scuola', n: 'Scuola padel principianti', ora: '18:00', min: 60, coach: 'Luca', ruolo: 'Maestro di padel', liv: 'Principiante', posti: 4, pres: 3, g: [2, 4], d: 'Quattro persone per campo: impugnatura, colpi base, uso delle pareti. Racchette in prestito.', port: ['Scarpe da padel o da tennis', 'Racchetta, se ce l\'hai'] },
    { id: 'pilates', n: 'Pilates matwork', ora: '13:15', min: 50, coach: 'Sara', ruolo: 'Istruttrice di pilates', liv: 'Tutti', posti: 12, pres: 5, g: [1, 2, 3, 4, 5], d: 'Lezione sul tappetino per schiena e postura, ritmo calmo.', port: ['Calze antiscivolo', 'Tappetino, se preferisci il tuo'] },
    { id: 'match', n: 'Americano del venerdì', ora: '20:30', min: 120, coach: 'Luca', ruolo: 'Organizza il torneo', liv: 'B1 - B3', posti: 16, pres: 13, g: [5], d: 'Torneo a rotazione: si cambia compagno a ogni partita. Si chiude con una birra al bar.', port: ['Racchetta', 'Voglia di giocare con persone nuove'] },
    { id: 'gag', n: 'Total body', ora: '19:00', min: 50, coach: 'Chiara', ruolo: 'Preparatrice atletica', liv: 'Intermedio', posti: 14, pres: 14, g: [1, 3], d: 'Forza e resistenza per tutto il corpo, con pesi leggeri e corpo libero.', port: ['Scarpe da ginnastica', 'Asciugamano'] },
    { id: 'kids', n: 'Padel ragazzi 8-14 anni', ora: '17:00', min: 60, coach: 'Luca', ruolo: 'Maestro di padel', liv: 'Ragazzi', posti: 8, pres: 6, g: [3, 6], d: 'Gioco e tecnica divisi per età. I genitori possono guardare dal bar.', port: ['Scarpe da ginnastica', 'Merenda'] }
  ];
  var st = mem.get('stato', { pren: [], ingressi: 8 });
  var sel = { g: 0, o: null, c: null, dur: 90 };
  var cg = 0;
  var byId = function (id) { return CORSI.filter(function (c) { return c.id === id; })[0]; };
  function toast(t) { var el = $('#toast'); el.textContent = t; el.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(function () { el.classList.remove('on'); }, 2400); }
  function salva() { mem.set('stato', st); $('#crediti').innerHTML = '<b>' + st.ingressi + '</b>ingressi'; }
  var chipGiorni = function (k, attr) { var h = ''; for (var i = 0; i < 7; i++) { var d = giorno(i); h += '<button type="button" ' + attr + '="' + i + '" aria-pressed="' + (i === k) + '"><small>' + (i ? GG[d.getDay()] : 'oggi') + '</small><b>' + d.getDate() + '</b></button>'; } return h; };

  function home() {
    var p = st.pren[0];
    $('#next').innerHTML = p ? '<a href="#/io"><span class="ora">' + p.ora + '</span><span><b>' + p.n + '</b><small>' + p.quando + '</small></span></a>' : (function () { var oggi = liberi(0); return '<a href="#/campi"><span class="ora">' + (oggi || liberi(1)) + '</span><span><b>' + (oggi ? 'orari ancora liberi oggi' : 'orari liberi domani') + '</b><small>Tocca per vedere i campi</small></span></a>'; })();
  }
  function liberi(k) { var n = 0, ora = k ? -1 : new Date().getHours(); ORE.forEach(function (o, i) { if (parseInt(o, 10) > ora) CAMPI.forEach(function (c, j) { if (!occ(k, i, j)) n++; }); }); return n; }
  function campi() {
    if (!campi.prima) { campi.prima = true; if (sel.g === 0 && !liberi(0)) sel.g = 1; }
    $('#giorni').innerHTML = chipGiorni(sel.g, 'data-g');
    var oraAdesso = new Date().getHours(), h = '<span></span>' + CAMPI.map(function (c) { return '<span class="h">' + c + '</span>'; }).join('');
    ORE.forEach(function (o, i) {
      h += '<span class="o">' + o + '</span>';
      CAMPI.forEach(function (c, j) {
        var passato = sel.g === 0 && parseInt(o, 10) <= oraAdesso, chiuso = occ(sel.g, i, j) || passato, scelto = sel.o === i && sel.c === j;
        h += '<button type="button" data-slot="' + i + '-' + j + '" aria-pressed="' + scelto + '"' + (chiuso ? ' disabled' : '') + ' aria-label="' + c + ' alle ' + o + (chiuso ? ', non disponibile' : ', libero') + '">' + (chiuso ? '' : (scelto ? 'Scelto' : euro(PREZZO(o, 60)))) + '</button>';
      });
    });
    $('#griglia').innerHTML = h;
    sheet();
  }
  function sheet() {
    var s = $('#sheet');
    if (sel.o === null) { s.hidden = true; return; }
    var o = ORE[sel.o], d = giorno(sel.g), p = PREZZO(o, sel.dur);
    s.hidden = false;
    s.innerHTML = '<h2>' + CAMPI[sel.c] + ' · ' + o + '</h2><p>' + (sel.g ? GG[d.getDay()] + ' ' + d.getDate() : 'Oggi') + ' · campo coperto, luci comprese</p><div class="seg" role="group" aria-label="Durata"><button type="button" data-dur="60" aria-pressed="' + (sel.dur === 60) + '">60 minuti</button><button type="button" data-dur="90" aria-pressed="' + (sel.dur === 90) + '">90 minuti</button></div><div class="split"><span>' + euro(p) + ' in totale</span><span><b>' + euro(Math.round(p / 4 * 100) / 100) + '</b> a testa in 4</span></div><button class="btn scuro full" type="button" id="conferma">Prenota il campo (demo)</button>';
  }
  function corsi() {
    $('#c-giorni').innerHTML = chipGiorni(cg, 'data-cg');
    var dow = giorno(cg).getDay(), lista = CORSI.filter(function (c) { return c.g.indexOf(dow) > -1; }).sort(function (a, b) { return parseFloat(a.ora.replace(':', '.')) - parseFloat(b.ora.replace(':', '.')); });
    $('#corsi').innerHTML = lista.length ? lista.map(function (c) { var lib = c.posti - c.pres - (prenotato(c.id) ? 1 : 0); return '<li><a href="#/lezione/' + c.id + '"><span class="ora">' + c.ora + '</span><span><b>' + c.n + '</b><small>' + c.min + ' min · con ' + c.coach + '</small></span><span class="posti' + (lib <= 2 ? ' pochi' : '') + '">' + (lib > 0 ? lib + (lib === 1 ? ' posto' : ' posti') : 'Pieno') + '</span></a></li>'; }).join('') : '<li class="nota">Nessun corso in questo giorno: il circolo è aperto solo per i campi.</li>';
  }
  var prenotato = function (id) { return st.pren.some(function (p) { return p.corso === id; }); };
  function lezione(id) {
    var c = byId(id) || CORSI[0], lib = c.posti - c.pres - (prenotato(c.id) ? 1 : 0), d = giorno(cg);
    $('#l-box').innerHTML = '<div class="l-head"><p class="kick">' + (cg ? GG[d.getDay()] + ' ' + d.getDate() : 'Oggi') + ' · ' + c.ora + '</p><h1 id="l-nome">' + c.n + '</h1><p>' + c.d + '</p></div>' +
      '<div class="dati"><div><b>' + c.min + '\'</b><small>durata</small></div><div><b>' + c.liv + '</b><small>livello</small></div><div><b>' + Math.max(0, lib) + '/' + c.posti + '</b><small>posti liberi</small></div></div>' +
      '<div class="coach"><span class="av" aria-hidden="true">' + c.coach[0] + '</span><div><b>' + c.coach + '</b><small>' + c.ruolo + ' · nome di esempio</small></div></div>' +
      '<h2 class="sec">Cosa portare</h2><ul class="portare">' + c.port.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>' +
      (prenotato(c.id) ? '<button class="btn full" type="button" disabled>Sei già iscritto</button>' : '<button class="btn full" type="button" data-iscrivi="' + c.id + '"' + (lib < 1 ? ' disabled' : '') + '>' + (lib < 1 ? 'Lezione piena' : 'Prenota il posto · 1 ingresso') + '</button>') + '<p class="nota">Puoi disdire fino a 3 ore prima senza perdere l\'ingresso.</p>';
  }
  function io() {
    $('#ingressi').textContent = st.ingressi;
    var lista = st.pren.length ? st.pren : [{ n: 'Campo 2 · 90 minuti', ora: '19:00', quando: 'giovedì scorso', es: 1 }];
    $('#pren').innerHTML = lista.map(function (p, i) { return '<li><div><b>' + p.n + '</b><small>' + p.quando + ' alle ' + p.ora + (p.es ? ' · esempio' : '') + '</small></div>' + (p.es ? '' : '<button type="button" data-disdici="' + i + '">Disdici</button>') + '</li>'; }).join('');
  }
  var R = { home: home, campi: campi, corsi: corsi, lezione: lezione, io: io };
  function route() {
    var p = location.hash.replace(/^#\/?/, '').split('/'), n = R[p[0]] ? p[0] : 'home';
    $$('[data-screen]').forEach(function (s) { s.hidden = s.dataset.screen !== n; });
    var tab = n === 'lezione' ? 'corsi' : n;
    $$('.tabbar a').forEach(function (a) { if (a.dataset.tab === tab) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    R[n](p[1]); window.scrollTo(0, 0); var sc = document.querySelector('.app > main'); if (sc) sc.scrollTop = 0;
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.dataset.g) { sel.g = +b.dataset.g; sel.o = sel.c = null; campi(); }
    else if (b.dataset.slot) { var x = b.dataset.slot.split('-'); sel.o = +x[0]; sel.c = +x[1]; campi(); }
    else if (b.dataset.dur) { sel.dur = +b.dataset.dur; sheet(); }
    else if (b.id === 'conferma') {
      var d = giorno(sel.g);
      st.pren.unshift({ n: CAMPI[sel.c] + ' · ' + sel.dur + ' minuti', ora: ORE[sel.o], quando: sel.g ? GG[d.getDay()] + ' ' + d.getDate() : 'oggi' });
      salva(); sel.o = sel.c = null; toast('Campo prenotato. Lo trovi in Io.'); campi();
    }
    else if (b.dataset.cg) { cg = +b.dataset.cg; corsi(); }
    else if (b.dataset.iscrivi) {
      var c = byId(b.dataset.iscrivi), dd = giorno(cg);
      st.pren.unshift({ n: c.n, ora: c.ora, quando: cg ? GG[dd.getDay()] + ' ' + dd.getDate() : 'oggi', corso: c.id }); st.ingressi = Math.max(0, st.ingressi - 1);
      salva(); toast('Posto prenotato: ' + c.n); lezione(c.id);
    }
    else if (b.dataset.disdici) { var p = st.pren.splice(+b.dataset.disdici, 1)[0]; if (p.corso) st.ingressi++; salva(); io(); toast('Prenotazione disdetta'); }
  });
  window.addEventListener('hashchange', route);
  salva(); route();
})();
