/* Vela Drive - sito dimostrativo. Nessun dato viene inviato: tutto resta nel browser. */
(function () {
  'use strict';

  /* ---------- Dati di esempio ---------- */
  var CARS = [
    { id: 'suv', name: 'SUV bianco Ostuni', cat: 'suv', catLabel: 'SUV', seats: 5, gear: 'Automatico', fuel: 'Ibrida', price: 189,
      img: 'img/suv-bianco.webp', alt: 'SUV bianco fotografato in studio',
      desc: 'Alto, comodo e con un bagagliaio grande: per famiglie, valigie e strade bianche verso le masserie.' },
    { id: 'spider', name: 'Spider rossa', cat: 'sportive', catLabel: 'Sportiva', seats: 2, gear: 'Automatico', fuel: 'Benzina', price: 390,
      img: 'img/spider-rossa.webp', alt: 'Spider rossa scoperta fotografata in studio',
      desc: 'Capote aperta e litoranea da Polignano a Otranto: la più divertente della flotta.' },
    { id: 'berlina', name: 'Berlina executive', cat: 'berline', catLabel: 'Berlina', seats: 5, gear: 'Automatico', fuel: 'Diesel', price: 229,
      img: 'img/berlina-nera.webp', alt: 'Berlina nera fotografata in studio',
      desc: 'Silenziosa e spaziosa anche dietro. Pensata per matrimoni, eventi e viaggi di lavoro.' },
    { id: 'elettrica', name: 'Elettrica argento', cat: 'elettriche', catLabel: 'Elettrica', seats: 4, gear: 'Automatico', fuel: 'Elettrica', price: 259, crop: true,
      img: 'img/elettrica-argento.webp', alt: 'Gran turismo elettrica argento fotografata in studio',
      desc: 'Gran turismo a batteria: scatto pronto e nessun rumore nei centri storici.' },
    { id: 'compatta', name: 'Compatta blu mare', cat: 'compatte', catLabel: 'Compatta', seats: 4, gear: 'Manuale', fuel: 'Benzina', price: 89, crop: true,
      img: 'img/compatta-blu.webp', alt: 'Compatta premium blu fotografata in studio',
      desc: 'Piccola fuori e curata dentro. Si parcheggia anche nei vicoli di Locorotondo.' }
  ];

  var PLACES = [
    { id: 'bari', label: 'Aeroporto di Bari' },
    { id: 'brindisi', label: 'Aeroporto di Brindisi' },
    { id: 'lecce', label: 'Stazione di Lecce' },
    { id: 'hotel', label: "Consegna in hotel (Valle d'Itria o Salento)" }
  ];

  var EXTRAS = [
    { id: 'driver', label: 'Secondo conducente', note: 'Può guidare anche un\'altra persona con gli stessi requisiti.', price: 12, per: 'day' },
    { id: 'seat', label: 'Seggiolino per bambini', note: 'Montato da noi prima della consegna.', price: 8, per: 'day' },
    { id: 'hotel', label: 'Consegna in hotel', note: 'Si attiva da sola se scegli l\'hotel come luogo di ritiro o di riconsegna.', price: 45, per: 'once', auto: true },
    { id: 'insurance', label: 'Assicurazione completa', note: 'Nessuna franchigia in caso di danni e cauzione più bassa.', price: 29, per: 'day' }
  ];

  var ONE_WAY_FEE = 60;
  var LONG_DAYS = 7;
  var LONG_DISCOUNT = 0.10;
  var DAY_MS = 86400000;
  var DRAFT_KEY = 'veladrive-bozza-v1';

  /* ---------- Utilità ---------- */
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  var sysReduce = reduceMQ.matches;
  var reduce = false;
  function refreshMotion() { reduce = sysReduce || document.documentElement.classList.contains('no-motion'); }
  refreshMotion();
  var onMotionChange = function () {};
  if (reduceMQ.addEventListener) reduceMQ.addEventListener('change', function (e) { sysReduce = e.matches; refreshMotion(); onMotionChange(); });

  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'text') n.textContent = attrs[k];
      else if (k === 'class') n.className = attrs[k];
      else n.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c != null) n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return n;
  }

  /* Euro all'italiana con il punto delle migliaia anche a 4 cifre: 1.170 €, 1.306,70 € */
  function fmtCents(cents) {
    var neg = cents < 0;
    var abs = Math.abs(Math.round(cents));
    var euros = Math.floor(abs / 100), rest = abs % 100;
    var txt = String(euros).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    if (rest) txt += ',' + (rest < 10 ? '0' : '') + rest;
    return (neg ? '−' : '') + txt + ' €';
  }
  function fmtEuro(e) { return fmtCents(Math.round(e * 100)); }

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function isoDate(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }

  function parseParts(d, t) {
    if (!d || !t) return null;
    var a = d.split('-').map(Number), b = t.split(':').map(Number);
    if (a.length !== 3 || b.length < 2 || a.some(isNaN) || b.some(isNaN)) return null;
    return { y: a[0], m: a[1], d: a[2], h: b[0], mi: b[1] };
  }
  function localDate(p) { return new Date(p.y, p.m - 1, p.d, p.h, p.mi); }
  function utcMs(p) { return Date.UTC(p.y, p.m - 1, p.d, p.h, p.mi); }

  var dateFmt = new Intl.DateTimeFormat('it-IT', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });
  function fmtWhen(d, t) {
    var p = parseParts(d, t);
    if (!p) return '';
    return dateFmt.format(localDate(p)) + ', ore ' + t;
  }
  function placeLabel(id) { var p = PLACES.find(function (x) { return x.id === id; }); return p ? p.label : ''; }

  /* Durata in giorni: ogni 24 ore o frazione conta come un giorno (calcolo in UTC per evitare il cambio d'ora). */
  function rentalInfo(pd, pt, rd, rt) {
    var p = parseParts(pd, pt), r = parseParts(rd, rt);
    if (!p || !r) return { ok: false };
    var diff = utcMs(r) - utcMs(p);
    return { ok: true, diff: diff, days: diff > 0 ? Math.max(1, Math.ceil(diff / DAY_MS)) : 0, pickup: localDate(p) };
  }

  /* Controllo date condiviso tra modulo rapido e prenotazione */
  function checkDates(pd, pt, rd, rt) {
    var res = { pickup: '', ret: '' };
    var p = parseParts(pd, pt);
    if (!p) res.pickup = 'Indica data e ora del ritiro.';
    else if (localDate(p).getTime() < Date.now() - 60000) res.pickup = 'Il ritiro non può essere nel passato: scegli una data da oggi in poi.';
    var r = parseParts(rd, rt);
    if (!r) res.ret = 'Indica data e ora della riconsegna.';
    else if (p) {
      var diff = utcMs(r) - utcMs(p);
      if (diff <= 0) res.ret = 'La riconsegna deve essere dopo il ritiro. Controlla data e ora.';
      else if (diff < DAY_MS) res.ret = 'Il noleggio minimo è di 1 giorno: scegli una riconsegna almeno 24 ore dopo il ritiro.';
    }
    return res;
  }

  /* ---------- Immagini mancanti: resta lo sfondo neutro ---------- */
  function guardImg(img) {
    if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) img.classList.add('is-missing');
    img.addEventListener('error', function () { img.classList.add('is-missing'); });
    img.addEventListener('load', function () { img.classList.remove('is-missing'); });
  }

  /* ---------- Icone schede auto ---------- */
  var ICONS = {
    seats: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="9" cy="7" r="3" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3.5 19c.6-3.3 2.7-5 5.5-5s4.9 1.7 5.5 5M16 4.5a3 3 0 010 5.6M18 14.2c1.5.7 2.4 2.2 2.6 4.8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    gear: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="6" cy="6" r="2" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="18" cy="6" r="2" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="18" r="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M6 8v4h12V8M12 12v4" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
    fuel: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 20V5.5A1.5 1.5 0 016.5 4h6A1.5 1.5 0 0114 5.5V20M3.5 20h12M5 10h9M14 9l3.5 2.5V17a1.5 1.5 0 003 0V9L18 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M13 3L5 13.5h6L10 21l8-10.5h-6L13 3z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>'
  };

  /* ---------- Flotta ---------- */
  var grid = $('#fleet-grid');
  var fleetStatus = $('#fleet-status');

  function renderFleet() {
    CARS.forEach(function (c) {
      var li = el('li', { class: 'car', 'data-cat': c.cat });
      var img = el('img', { src: c.img, alt: c.alt, width: '800', height: '600', loading: 'lazy', decoding: 'async', class: c.crop ? 'crop-top' : '' });
      guardImg(img);
      var specs = el('ul', { class: 'specs', 'aria-label': 'Caratteristiche' });
      specs.innerHTML =
        '<li>' + ICONS.seats + c.seats + ' posti</li>' +
        '<li>' + ICONS.gear + 'Cambio ' + c.gear.toLowerCase() + '</li>' +
        '<li>' + (c.fuel === 'Elettrica' ? ICONS.bolt : ICONS.fuel) + c.fuel + '</li>';
      var btn = el('button', { type: 'button', class: 'btn btn-ghost', 'data-book': c.id, 'aria-label': 'Prenota ' + c.name }, ['Prenota questa']);
      var price = el('p', { class: 'car-price' }, [el('strong', { text: fmtEuro(c.price) }), 'al giorno']);
      li.appendChild(el('article', { 'aria-labelledby': 'car-' + c.id }, [
        el('div', { class: 'car-media' }, [img]),
        el('div', { class: 'car-body' }, [
          el('p', { class: 'car-cat', text: c.catLabel }),
          el('h3', { id: 'car-' + c.id, text: c.name }),
          el('p', { class: 'car-desc', text: c.desc }),
          specs,
          el('div', { class: 'car-foot' }, [price, btn])
        ])
      ]));
      grid.appendChild(li);
    });
  }

  var filterTimer = null;
  function applyFilter(cat) {
    $$('.chip').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.filter === cat)); });
    var cards = $$('.car', grid);
    var match = function (c) { return cat === 'all' || c.dataset.cat === cat; };
    var toHide = cards.filter(function (c) { return !c.hidden && !match(c); });
    var toShow = cards.filter(match);
    var stay = toShow.filter(function (c) { return !c.hidden; });
    var first = new Map(stay.map(function (c) { return [c, c.getBoundingClientRect()]; }));

    if (filterTimer) { clearTimeout(filterTimer); }
    toHide.forEach(function (c) { c.classList.add('is-out'); });

    filterTimer = setTimeout(function () {
      filterTimer = null;
      cards.forEach(function (c) { c.classList.remove('is-out'); c.hidden = !match(c); });
      grid.dataset.count = String(toShow.length);
      var fresh = toShow.filter(function (c) { return !first.has(c); });
      fresh.forEach(function (c) { c.classList.add('is-in'); });

      /* Le schede rimaste scivolano nella nuova posizione */
      if (!reduce && grid.animate) {
        stay.forEach(function (c) {
          var a = first.get(c), b = c.getBoundingClientRect();
          var dx = a.left - b.left, dy = a.top - b.top;
          if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
            c.animate([{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'none' }],
              { duration: 480, easing: 'cubic-bezier(.2,.7,.2,1)' });
          }
        });
      }
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          fresh.forEach(function (c, i) {
            c.style.transitionDelay = (i * 70) + 'ms';
            c.classList.remove('is-in');
            setTimeout(function () { c.style.transitionDelay = ''; }, 500 + i * 70);
          });
        });
      });
      fleetStatus.textContent = toShow.length === 1 ? '1 auto mostrata' : toShow.length + ' auto mostrate';
    }, toHide.length ? 230 : 0);
  }

  /* ---------- Luoghi nei menu a tendina ---------- */
  function fillPlaces() {
    $$('select[data-places]').forEach(function (s) {
      s.appendChild(el('option', { value: '', text: 'Scegli un luogo' }));
      PLACES.forEach(function (p) { s.appendChild(el('option', { value: p.id, text: p.label })); });
    });
  }

  /* ---------- Prenotazione: campi ---------- */
  var form = $('#booking');
  var F = {
    pickupPlace: $('#b-pplace'), differentReturn: $('#b-diff'), returnPlace: $('#b-rplace'), hotelName: $('#b-hotel'),
    pickupDate: $('#b-pdate'), pickupTime: $('#b-ptime'), returnDate: $('#b-rdate'), returnTime: $('#b-rtime'),
    name: $('#d-name'), email: $('#d-email'), phone: $('#d-phone'), age: $('#d-age'), license: $('#d-license')
  };

  function renderChoices() {
    var box = $('#car-choices');
    CARS.forEach(function (c) {
      var img = el('img', { src: c.img, alt: '', width: '168', height: '126', loading: 'lazy', class: c.crop ? 'crop-top' : '' });
      guardImg(img);
      box.appendChild(el('label', { class: 'choice' }, [
        el('input', { type: 'radio', name: 'car', value: c.id, id: 'car-opt-' + c.id }),
        el('span', { class: 'choice-body' }, [
          el('span', { class: 'choice-thumb' }, [img]),
          el('span', {}, [
            el('span', { class: 'choice-name', text: c.name }),
            el('span', { class: 'choice-meta', text: c.catLabel + ' · ' + c.seats + ' posti · ' + c.gear }),
            el('span', { class: 'choice-price', text: fmtEuro(c.price) + ' al giorno' })
          ])
        ])
      ]));
    });

    var ex = $('#extras');
    EXTRAS.forEach(function (x) {
      var input = el('input', { type: 'checkbox', id: 'x-' + x.id, name: 'extra-' + x.id });
      var priceTxt = x.per === 'day' ? fmtEuro(x.price) + ' al giorno' : fmtEuro(x.price) + ' una volta';
      var lab = el('label', { class: 'extra' + (x.auto ? ' is-locked' : ''), for: 'x-' + x.id }, [
        input,
        el('span', { class: 'extra-text' }, [
          el('span', { class: 'extra-name', text: x.label }),
          el('span', { class: 'extra-note', text: x.note })
        ]),
        el('span', { class: 'extra-price', text: priceTxt })
      ]);
      if (x.auto) input.disabled = true;
      ex.appendChild(lab);
    });
  }

  function getValues() {
    var car = form.querySelector('input[name="car"]:checked');
    return {
      pickupPlace: F.pickupPlace.value,
      differentReturn: F.differentReturn.checked,
      returnPlace: F.returnPlace.value,
      hotelName: F.hotelName.value,
      pickupDate: F.pickupDate.value, pickupTime: F.pickupTime.value,
      returnDate: F.returnDate.value, returnTime: F.returnTime.value,
      car: car ? car.value : '',
      extras: {
        driver: $('#x-driver').checked,
        seat: $('#x-seat').checked,
        insurance: $('#x-insurance').checked
      },
      name: F.name.value, email: F.email.value, phone: F.phone.value, age: F.age.value, license: F.license.value
    };
  }

  function setValues(v) {
    ['pickupPlace', 'returnPlace', 'hotelName', 'pickupDate', 'pickupTime', 'returnDate', 'returnTime', 'name', 'email', 'phone', 'age', 'license']
      .forEach(function (k) { if (typeof v[k] === 'string') F[k].value = v[k]; });
    F.differentReturn.checked = !!v.differentReturn;
    $$('input[name="car"]', form).forEach(function (r) { r.checked = r.value === v.car; });
    if (v.extras) {
      $('#x-driver').checked = !!v.extras.driver;
      $('#x-seat').checked = !!v.extras.seat;
      $('#x-insurance').checked = !!v.extras.insurance;
    }
  }

  function returnPlaceOf(v) { return v.differentReturn && v.returnPlace ? v.returnPlace : v.pickupPlace; }
  function needsHotel(v) { return v.pickupPlace === 'hotel' || (v.differentReturn && v.returnPlace === 'hotel'); }
  function isOneWay(v) { return v.differentReturn && v.returnPlace && v.pickupPlace && v.returnPlace !== v.pickupPlace; }

  /* ---------- Calcolo del prezzo (in centesimi) ---------- */
  function calc(v) {
    var car = CARS.find(function (c) { return c.id === v.car; });
    var info = rentalInfo(v.pickupDate, v.pickupTime, v.returnDate, v.returnTime);
    var days = info.ok ? info.days : 0;
    var rows = [], total = 0;
    if (car && days) {
      var base = car.price * days * 100;
      rows.push({ label: car.name + ' · ' + days + (days === 1 ? ' giorno' : ' giorni') + ' × ' + fmtEuro(car.price), cents: base });
      total += base;
      if (days >= LONG_DAYS) {
        var disc = -Math.round(base * LONG_DISCOUNT);
        rows.push({ label: 'Sconto 10% sul noleggio (da 7 giorni)', cents: disc, discount: true });
        total += disc;
      }
    }
    if (days) {
      EXTRAS.forEach(function (x) {
        var on = x.id === 'hotel' ? needsHotel(v) : v.extras[x.id];
        if (!on) return;
        var amount = x.price * (x.per === 'day' ? days : 1) * 100;
        rows.push({ label: x.label + (x.per === 'day' ? ' · ' + days + ' × ' + fmtEuro(x.price) : ''), cents: amount });
        total += amount;
      });
      if (isOneWay(v)) {
        rows.push({ label: 'Riconsegna in un altro luogo', cents: ONE_WAY_FEE * 100 });
        total += ONE_WAY_FEE * 100;
      }
    }
    return { car: car, days: days, rows: rows, total: car && days ? total : 0 };
  }

  /* ---------- Totale che "conta" ---------- */
  var shownTotal = 0, totalRaf = 0, liveTimer = 0;
  function showTotal(cents) {
    var targets = $$('[data-total]');
    var from = shownTotal;
    shownTotal = cents;
    cancelAnimationFrame(totalRaf);
    if (from === cents) { targets.forEach(function (t) { t.textContent = fmtCents(cents); }); return; }
    targets.forEach(function (t) { t.classList.remove('is-bump'); void t.offsetWidth; t.classList.add('is-bump'); });
    var t0 = performance.now(), dur = 600;
    function tick(now) {
      var k = Math.min(1, (now - t0) / dur);
      var e = 1 - Math.pow(1 - k, 3);
      var val = k < 1 ? Math.round((from + (cents - from) * e) / 100) * 100 : cents;
      targets.forEach(function (t) { t.textContent = fmtCents(val); });
      if (k < 1) totalRaf = requestAnimationFrame(tick);
    }
    totalRaf = requestAnimationFrame(tick);
    clearTimeout(liveTimer);
    liveTimer = setTimeout(function () {
      $('#total-live').textContent = cents ? 'Totale aggiornato: ' + fmtCents(cents) : '';
    }, 700);
  }

  function updatePrice() {
    var v = getValues();
    var r = calc(v);
    var list = $('#price-rows');
    list.textContent = '';
    r.rows.forEach(function (row) {
      list.appendChild(el('li', { class: row.discount ? 'is-discount' : '' }, [
        el('span', { text: row.label }), el('span', { text: fmtCents(row.cents) })
      ]));
    });
    $('#price-empty').hidden = r.rows.length > 0;
    showTotal(r.total);
    $('#mini-total-label').textContent = r.days ? 'Totale · ' + r.days + (r.days === 1 ? ' giorno' : ' giorni') : 'Totale';

    var info = rentalInfo(v.pickupDate, v.pickupTime, v.returnDate, v.returnTime);
    var dur = $('#b-duration');
    if (info.ok && info.diff >= DAY_MS) {
      var txt = 'Durata: ' + info.days + (info.days === 1 ? ' giorno' : ' giorni');
      if (info.days >= LONG_DAYS) txt += ' · hai diritto allo sconto del 10%';
      else txt += ' · da 7 giorni in su lo sconto è del 10%';
      dur.textContent = txt;
    } else dur.textContent = '';

    updateWhatsApp(v);

    var hotelBox = $('#x-hotel');
    if (hotelBox) hotelBox.checked = needsHotel(v);
  }

  /* WhatsApp: link senza numero, con il messaggio già scritto (usa le date solo se le hai scelte tu) */
  var datesChosen = false;
  var shortDate = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'long' });
  function updateWhatsApp(v) {
    var link = $('#wa-link');
    if (!link) return;
    var msg = 'Ciao, vorrei informazioni per noleggiare un\'auto con Vela Drive.';
    var p = parseParts(v.pickupDate, v.pickupTime), r = parseParts(v.returnDate, v.returnTime);
    if (datesChosen && p && r && utcMs(r) > utcMs(p)) {
      msg = 'Ciao, vorrei un\'auto dal ' + shortDate.format(localDate(p)) + ' (ore ' + v.pickupTime + ') al ' +
        shortDate.format(localDate(r)) + ' (ore ' + v.returnTime + ')';
      if (v.pickupPlace) msg += ', con ritiro: ' + placeLabel(v.pickupPlace);
      if (isOneWay(v)) msg += ' e riconsegna: ' + placeLabel(v.returnPlace);
      var car = CARS.find(function (c) { return c.id === v.car; });
      if (car) msg += '. Mi interessa la ' + car.name;
      msg += '. È disponibile?';
    }
    link.href = 'https://wa.me/?text=' + encodeURIComponent(msg);
    link.dataset.message = msg;
  }

  function updateConditional() {
    var v = getValues();
    $('#cond-return').hidden = !v.differentReturn;
    $('#cond-hotel').hidden = !needsHotel(v);
  }

  /* ---------- Regole di validazione ---------- */
  var RULES = {
    pickupPlace: { step: 1, inputs: [F.pickupPlace], test: function (v) { return v.pickupPlace ? '' : 'Scegli dove ritirare l\'auto.'; } },
    returnPlace: { step: 1, inputs: [F.returnPlace], when: function (v) { return v.differentReturn; },
      test: function (v) {
        if (!v.returnPlace) return 'Scegli dove riconsegnare l\'auto.';
        if (v.returnPlace === v.pickupPlace) return 'È lo stesso luogo del ritiro: scegline un altro oppure togli la spunta qui sopra.';
        return '';
      } },
    hotelName: { step: 1, inputs: [F.hotelName], when: needsHotel,
      test: function (v) { return v.hotelName.trim().length >= 3 ? '' : 'Scrivi il nome dell\'hotel e il paese.'; } },
    pickup: { step: 1, inputs: [F.pickupDate, F.pickupTime],
      test: function (v) { return checkDates(v.pickupDate, v.pickupTime, v.returnDate, v.returnTime).pickup; } },
    'return': { step: 1, inputs: [F.returnDate, F.returnTime],
      test: function (v) { return checkDates(v.pickupDate, v.pickupTime, v.returnDate, v.returnTime).ret; } },
    car: { step: 2, inputs: [], group: '#car-group', test: function (v) { return v.car ? '' : 'Scegli una delle cinque auto.'; } },
    name: { step: 3, inputs: [F.name], test: function (v) {
      var n = v.name.trim();
      return n.length >= 4 && /\S+\s+\S+/.test(n) ? '' : 'Scrivi nome e cognome.';
    } },
    email: { step: 3, inputs: [F.email], test: function (v) {
      var e = v.email.trim();
      if (!e) return 'Scrivi la tua email.';
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e) ? '' : 'Controlla l\'email: deve essere come nome@esempio.it.';
    } },
    phone: { step: 3, inputs: [F.phone], test: function (v) {
      var p = v.phone.trim();
      if (!p) return 'Scrivi un numero di telefono.';
      var digits = p.replace(/\D/g, '');
      return /^\+?[\d\s().-]+$/.test(p) && digits.length >= 8 && digits.length <= 15 ? '' : 'Controlla il numero: solo cifre, anche con il prefisso +39.';
    } },
    age: { step: 3, inputs: [F.age], test: function (v) {
      if (v.age === '') return 'Scrivi la tua età.';
      var a = Number(v.age);
      if (!Number.isInteger(a) || a < 18 || a > 99) return 'Controlla l\'età: scrivi un numero tra 18 e 99.';
      return a >= 25 ? '' : 'Per noleggiare serve avere almeno 25 anni.';
    } },
    license: { step: 3, inputs: [F.license], test: function (v) {
      if (!v.license) return 'Indica la data in cui hai preso la patente.';
      var l = v.license.split('-').map(Number);
      var lic = new Date(l[0], l[1] - 1, l[2]);
      if (isNaN(lic.getTime())) return 'Controlla la data della patente.';
      if (lic.getTime() > Date.now()) return 'La data della patente non può essere nel futuro.';
      var ref = parseParts(v.pickupDate, v.pickupTime);
      var refDate = ref ? localDate(ref) : new Date();
      var limit = new Date(lic.getFullYear() + 3, lic.getMonth(), lic.getDate());
      return limit.getTime() <= refDate.getTime() ? '' : 'Serve la patente da almeno 3 anni al giorno del ritiro.';
    } }
  };

  function setError(key, msg) {
    var r = RULES[key];
    var box = $('#err-' + key);
    if (box) box.textContent = msg;
    r.inputs.forEach(function (i) { if (msg) i.setAttribute('aria-invalid', 'true'); else i.removeAttribute('aria-invalid'); });
    if (r.group) { var g = $(r.group); if (msg) g.setAttribute('aria-invalid', 'true'); else g.removeAttribute('aria-invalid'); }
  }

  function ruleMsg(key, v) {
    var r = RULES[key];
    if (r.when && !r.when(v)) return '';
    return r.test(v);
  }

  function validateStep(n, show) {
    var v = getValues(), firstKey = null, count = 0;
    Object.keys(RULES).forEach(function (k) {
      if (RULES[k].step !== n) return;
      var msg = ruleMsg(k, v);
      if (show) setError(k, msg);
      if (msg) { count++; if (!firstKey) firstKey = k; }
    });
    return { ok: count === 0, count: count, first: firstKey };
  }

  function keyOfInput(input) {
    var found = null;
    Object.keys(RULES).forEach(function (k) {
      if (RULES[k].inputs.indexOf(input) > -1) found = k;
    });
    if (!found && input.name === 'car') found = 'car';
    return found;
  }

  function focusRule(key) {
    var r = RULES[key];
    var target = r.inputs[0] || (r.group ? $(r.group + ' input') : null);
    if (target) target.focus();
  }

  /* ---------- Passi ---------- */
  var step = 1, stepTimer = null;
  var panels = $$('.panel', form);
  var stepAlert = $('#step-alert');
  var bookCard = $('#book-card');

  function updateProgress() {
    $$('#progress li').forEach(function (li) {
      var n = Number(li.dataset.step);
      li.classList.toggle('is-done', n < step);
      if (n === step) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
    });
    var frac = step >= 4 ? 1 : (step - 1) / 3 + 1 / 6;
    $('#progress-fill').style.transform = 'scaleX(' + frac + ')';
  }

  function showStep(n, opts) {
    opts = opts || {};
    var to = panels.find(function (p) { return Number(p.dataset.panel) === n; });
    var from = panels.find(function (p) { return !p.hidden; });
    var dir = n >= step ? 1 : -1;
    step = n;
    updateProgress();
    stepAlert.textContent = '';
    if (n === 4) renderReview($('#review'), true);

    if (stepTimer) { clearTimeout(stepTimer); stepTimer = null; panels.forEach(function (p) { p.classList.remove('is-leaving'); }); }

    function enter() {
      panels.forEach(function (p) { if (p !== to) p.hidden = true; });
      to.hidden = false;
      if (!opts.instant) {
        to.style.setProperty('--dir', dir);
        to.classList.add('is-entering');
        requestAnimationFrame(function () { requestAnimationFrame(function () { to.classList.remove('is-entering'); }); });
      }
      if (opts.focus !== false) {
        var h = $('.panel-title', to);
        if (h) h.focus({ preventScroll: true });
      }
      if (opts.scroll !== false) {
        var top = bookCard.getBoundingClientRect().top;
        if (top < 0 || top > window.innerHeight * 0.6 || opts.forceScroll) {
          bookCard.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
        }
      }
    }

    if (opts.instant || !from || from === to) { enter(); return; }
    from.style.setProperty('--dir', dir);
    from.classList.add('is-leaving');
    stepTimer = setTimeout(function () {
      stepTimer = null;
      from.classList.remove('is-leaving');
      enter();
    }, 220);
  }

  function goNext() {
    if (step > 3) return;
    var res = validateStep(step, true);
    if (!res.ok) {
      stepAlert.textContent = res.count === 1 ? 'Controlla il campo segnalato prima di continuare.' : 'Controlla i ' + res.count + ' campi segnalati prima di continuare.';
      focusRule(res.first);
      return;
    }
    showStep(step + 1);
    saveDraft();
  }

  function goPrev() {
    if (step <= 1 || step > 4) return;
    showStep(step - 1);
    saveDraft();
  }

  /* ---------- Riepilogo ---------- */
  function renderReview(box, withEdit) {
    var v = getValues(), r = calc(v);
    box.textContent = '';
    box.className = 'review';

    function block(title, editStep, rows) {
      var head = el('div', { class: 'review-head' }, [el('h4', { text: title })]);
      if (withEdit) {
        var b = el('button', { type: 'button', class: 'btn btn-text', 'aria-label': 'Modifica: ' + title.toLowerCase() }, ['Modifica']);
        b.addEventListener('click', function () { showStep(editStep); });
        head.appendChild(b);
      }
      var dl = el('dl');
      rows.forEach(function (row) { dl.appendChild(el('div', {}, [el('dt', { text: row[0] }), el('dd', { text: row[1] })])); });
      return el('div', { class: 'review-block' }, [head, dl]);
    }

    var pickupTxt = placeLabel(v.pickupPlace) + (v.pickupPlace === 'hotel' && v.hotelName ? ' · ' + v.hotelName.trim() : '');
    var rp = returnPlaceOf(v);
    var returnTxt = placeLabel(rp) + (rp === 'hotel' && v.hotelName ? ' · ' + v.hotelName.trim() : '') + (isOneWay(v) ? '' : ' (stesso luogo)');
    box.appendChild(block('Luogo e date', 1, [
      ['Ritiro', pickupTxt],
      ['Quando', fmtWhen(v.pickupDate, v.pickupTime)],
      ['Riconsegna', returnTxt],
      ['Quando', fmtWhen(v.returnDate, v.returnTime)],
      ['Durata', r.days + (r.days === 1 ? ' giorno' : ' giorni')]
    ]));

    var chosen = EXTRAS.filter(function (x) { return x.id === 'hotel' ? needsHotel(v) : v.extras[x.id]; }).map(function (x) { return x.label; });
    box.appendChild(block('Auto ed extra', 2, [
      ['Auto', r.car ? r.car.name + ' (' + r.car.catLabel + ')' : '-'],
      ['Extra', chosen.length ? chosen.join(', ') : 'Nessuno']
    ]));

    var lic = v.license ? dateFmt.format(new Date(v.license + 'T12:00:00')) : '';
    box.appendChild(block('Chi guida', 3, [
      ['Nome', v.name.trim()], ['Email', v.email.trim()], ['Telefono', v.phone.trim()],
      ['Età', v.age ? v.age + ' anni' : ''], ['Patente dal', lic]
    ]));

    var prices = el('ul', { class: 'review-prices' });
    r.rows.forEach(function (row) {
      prices.appendChild(el('li', { class: row.discount ? 'is-discount' : '' }, [el('span', { text: row.label }), el('span', { text: fmtCents(row.cents) })]));
    });
    prices.appendChild(el('li', { class: 'is-total' }, [el('span', { text: 'Totale' }), el('span', { text: fmtCents(r.total) })]));
    box.appendChild(el('div', { class: 'review-block' }, [el('div', { class: 'review-head' }, [el('h4', { text: 'Prezzo' })]), prices]));
  }

  /* ---------- Bozza nel browser ---------- */
  var sent = false;
  function saveDraft() {
    if (sent) return;
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ v: 1, step: Math.min(step, 4), savedAt: Date.now(), values: getValues() }));
    } catch (e) { /* archivio non disponibile: la pagina funziona lo stesso */ }
  }
  function readDraft() {
    try {
      var raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return null;
      var d = JSON.parse(raw);
      return d && d.v === 1 && d.values ? d : null;
    } catch (e) { return null; }
  }
  function clearDraft() { try { localStorage.removeItem(DRAFT_KEY); } catch (e) { /* niente */ } }

  /* ---------- Date predefinite ---------- */
  function setDefaults() {
    var today = new Date();
    var t1 = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    var t2 = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4);
    var min = isoDate(today);
    [F.pickupDate, F.returnDate, $('#q-pdate'), $('#q-rdate')].forEach(function (i) { i.min = min; });
    F.license.max = min;
    F.pickupDate.value = isoDate(t1); F.pickupTime.value = '10:00';
    F.returnDate.value = isoDate(t2); F.returnTime.value = '10:00';
    $('#q-pdate').value = isoDate(t1); $('#q-ptime').value = '10:00';
    $('#q-rdate').value = isoDate(t2); $('#q-rtime').value = '10:00';
  }

  function resetBooking() {
    clearDraft();
    sent = false;
    form.reset();
    setDefaults();
    Object.keys(RULES).forEach(function (k) { setError(k, ''); });
    updateConditional();
    updatePrice();
    $('#draft-note').hidden = true;
    showStep(1, { instant: true, focus: true, forceScroll: true });
  }

  /* ---------- Invio di prova ---------- */
  function makeCode() {
    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', out = '';
    var buf = new Uint32Array(6);
    if (window.crypto && crypto.getRandomValues) crypto.getRandomValues(buf);
    else for (var i = 0; i < 6; i++) buf[i] = Math.floor(Math.random() * 4294967295);
    for (var j = 0; j < 6; j++) out += chars[buf[j] % chars.length];
    return 'VD-' + out;
  }

  function send() {
    for (var s = 1; s <= 3; s++) {
      var res = validateStep(s, true);
      if (!res.ok) {
        showStep(s);
        stepAlert.textContent = 'Manca qualcosa in questo passo: controlla i campi segnalati.';
        setTimeout(function () { focusRule(res.first); }, 260);
        return;
      }
    }
    $('#done-code').textContent = makeCode();
    renderReview($('#done-summary'), false);
    sent = true;
    clearDraft();
    $('#draft-note').hidden = true;
    showStep(5, { forceScroll: true });
  }

  /* ---------- Modulo rapido in apertura ---------- */
  function setQuickError(id, inputs, msg) {
    $('#' + id).textContent = msg;
    inputs.forEach(function (i) { if (msg) i.setAttribute('aria-invalid', 'true'); else i.removeAttribute('aria-invalid'); });
  }
  function validateQuick() {
    var place = $('#q-place'), pd = $('#q-pdate'), pt = $('#q-ptime'), rd = $('#q-rdate'), rt = $('#q-rtime');
    var d = checkDates(pd.value, pt.value, rd.value, rt.value);
    var pm = place.value ? '' : 'Scegli dove ritirare l\'auto.';
    setQuickError('err-q-place', [place], pm);
    setQuickError('err-q-pickup', [pd, pt], d.pickup);
    setQuickError('err-q-return', [rd, rt], d.ret);
    if (pm) return place;
    if (d.pickup) return pd;
    if (d.ret) return rd;
    return null;
  }

  function goToBooking() {
    var target = validateStep(1, false).ok ? 2 : 1;
    showStep(target, { instant: true, focus: false, scroll: false });
    $('#prenota').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    setTimeout(function () {
      var h = $('.panel-title', panels[target - 1]);
      if (h) h.focus({ preventScroll: true });
    }, reduce ? 0 : 500);
  }

  /* ---------- Avvio ---------- */
  function init() {
    $$('img').forEach(guardImg);
    fillPlaces();
    renderFleet();
    renderChoices();
    setDefaults();

    /* Filtri */
    $$('.chip').forEach(function (b) { b.addEventListener('click', function () { applyFilter(b.dataset.filter); }); });

    /* "Prenota questa" */
    grid.addEventListener('click', function (e) {
      var b = e.target.closest('[data-book]');
      if (!b) return;
      var radio = $('#car-opt-' + b.dataset.book);
      if (radio) radio.checked = true;
      setError('car', '');
      updatePrice();
      saveDraft();
      goToBooking();
    });

    /* Modulo rapido */
    var quick = $('#quick');
    quick.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = validateQuick();
      if (bad) { bad.focus(); return; }
      F.pickupPlace.value = $('#q-place').value;
      F.pickupDate.value = $('#q-pdate').value; F.pickupTime.value = $('#q-ptime').value;
      F.returnDate.value = $('#q-rdate').value; F.returnTime.value = $('#q-rtime').value;
      datesChosen = true;
      updateConditional(); updatePrice();
      ['pickupPlace', 'pickup', 'return'].forEach(function (k) { setError(k, ''); });
      saveDraft();
      goToBooking();
    });
    quick.addEventListener('change', function (e) {
      if (e.target.getAttribute('aria-invalid') === 'true') validateQuick();
    });

    /* Prenotazione: eventi */
    function onEdit(e) {
      if ([F.pickupDate, F.pickupTime, F.returnDate, F.returnTime].indexOf(e.target) > -1) datesChosen = true;
      updateConditional();
      updatePrice();
      var t = e.target;
      var key = keyOfInput(t);
      if (key) {
        var invalid = t.getAttribute('aria-invalid') === 'true' || (RULES[key].group && $(RULES[key].group).getAttribute('aria-invalid') === 'true');
        if (invalid || e.type === 'change') {
          if (invalid || t.type === 'radio' || t.tagName === 'SELECT') setError(key, ruleMsg(key, getValues()));
        }
        /* date collegate: aggiorna anche l'altro controllo se già segnalato */
        if (key === 'pickup' || key === 'return') datesChosen = true;
        if (key === 'pickup' && F.returnDate.getAttribute('aria-invalid') === 'true') setError('return', ruleMsg('return', getValues()));
        if (key === 'pickup' && F.license.getAttribute('aria-invalid') === 'true') setError('license', ruleMsg('license', getValues()));
      }
      if (t === F.pickupPlace || t === F.differentReturn) {
        if (F.returnPlace.getAttribute('aria-invalid') === 'true') setError('returnPlace', ruleMsg('returnPlace', getValues()));
        if (F.hotelName.getAttribute('aria-invalid') === 'true') setError('hotelName', ruleMsg('hotelName', getValues()));
      }
      if (!sent) saveDraft();
    }
    form.addEventListener('input', onEdit);
    form.addEventListener('change', onEdit);
    /* Se si sta premendo un bottone del passo, non mostrare errori al blur:
       il testo che compare spingerebbe il bottone più in basso e il clic andrebbe perso.
       Ci pensa già il bottone a controllare tutto il passo. */
    var pressingAction = false;
    form.addEventListener('pointerdown', function (e) {
      if (e.target.closest('.panel-actions button, .review-head button')) {
        pressingAction = true;
        setTimeout(function () { pressingAction = false; }, 700);
      }
    });
    form.addEventListener('focusout', function (e) {
      var t = e.target;
      if (!t.matches('input, select') || t.type === 'radio' || t.type === 'checkbox') return;
      if (pressingAction || (e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('.panel-actions'))) return;
      var key = keyOfInput(t);
      if (!key) return;
      /* per le coppie data+ora controlla quando il focus lascia la coppia */
      var r = RULES[key];
      if (r.inputs.length > 1 && r.inputs.indexOf(e.relatedTarget) > -1) return;
      if (t.value === '' && !t.getAttribute('aria-invalid') && r.inputs.length === 1) return;
      setError(key, ruleMsg(key, getValues()));
    });

    form.addEventListener('click', function (e) {
      if (e.target.closest('[data-next]')) goNext();
      else if (e.target.closest('[data-prev]')) goPrev();
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (step <= 3) goNext();
      else if (step === 4) send();
    });

    $('#restart').addEventListener('click', resetBooking);
    $('#draft-reset').addEventListener('click', resetBooking);

    /* Ripristino della bozza */
    var draft = readDraft();
    if (draft) {
      setValues(draft.values);
      updateConditional();
      var target = Math.min(Math.max(1, draft.step | 0), 4);
      for (var s = 1; s < target; s++) { if (!validateStep(s, false).ok) { target = s; break; } }
      $('#draft-note').hidden = false;
      datesChosen = true;
      updatePrice();
      showStep(target, { instant: true, focus: false, scroll: false });
    } else {
      updateConditional();
      updatePrice();
      showStep(1, { instant: true, focus: false, scroll: false });
    }

    initFaq();
    initMenu();
    initScrollFx();
  }

  /* ---------- Domande a fisarmonica ---------- */
  function initFaq() {
    $$('.faq-q').forEach(function (b) {
      b.addEventListener('click', function () {
        var open = b.getAttribute('aria-expanded') !== 'true';
        b.setAttribute('aria-expanded', String(open));
        b.closest('.faq-item').classList.toggle('is-open', open);
      });
    });
  }

  /* ---------- Menu del telefono ---------- */
  function initMenu() {
    var btn = $('.menu-btn'), nav = $('#menu');
    function close(returnFocus) {
      if (btn.getAttribute('aria-expanded') !== 'true') return;
      btn.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
      if (returnFocus) btn.focus();
    }
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
      if (open) { var a = $('a', nav); if (a) a.focus(); }
    });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) close(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(true); });
    document.addEventListener('click', function (e) { if (!e.target.closest('.header-inner')) close(false); });
  }

  /* ---------- Effetti allo scorrimento ---------- */
  function initScrollFx() {
    var reveals = $$('.reveal');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      reveals.forEach(function (r) { io.observe(r); });
    } else reveals.forEach(function (r) { r.classList.add('is-in'); });

    var header = $('.site-header');
    var hero = $('.hero'), stage = $('.hero-stage'), heroMedia = $('.hero-media'), heroText = $('.hero-text');
    var dusk = $('.hero-dusk'), quickForm = $('#quick');
    var cabin = $('.cabin'), cabinImg = $('.cabin-media img');
    var howSteps = $('#how-steps'), howItems = $$('.how-step');
    var cta = $('#mobile-cta'), ctaLink = $('a', cta);
    var booking = $('#prenota'), footer = $('.site-footer');
    var ticking = false, sceneOn = false;

    /* Scena d'apertura (solo computer, solo con le animazioni attive) */
    function updateScene() {
      var want = !reduce && window.innerWidth >= 1000 && window.innerHeight >= 640;
      if (want === sceneOn) return;
      sceneOn = want;
      hero.classList.toggle('is-scene', want);
      if (!want) {
        [heroMedia, heroText, quickForm].forEach(function (n) { n.style.transform = ''; });
        heroText.style.opacity = ''; dusk.style.opacity = '';
        hero.dataset.progress = '0';
      }
    }

    function frame() {
      ticking = false;
      var y = window.scrollY, vh = window.innerHeight;
      header.classList.toggle('is-scrolled', y > 8);

      /* Apertura: mentre scorri l'auto si allontana lungo la strada, la luce cala e il testo sale.
         Avanti avanza, indietro torna. */
      if (sceneOn) {
        var range = hero.offsetHeight - stage.offsetHeight;
        var top = hero.getBoundingClientRect().top - header.offsetHeight;
        var p = range > 0 ? Math.min(1, Math.max(0, -top / range)) : 0;
        var e = p * p * (3 - 2 * p);
        heroMedia.style.transform = 'translate3d(' + (-2.5 * e).toFixed(2) + '%,' + (-3 * e).toFixed(2) + '%,0) scale(' + (1 + 0.15 * e).toFixed(3) + ')';
        dusk.style.opacity = (0.45 * e).toFixed(3);
        heroText.style.transform = 'translate3d(0,' + (-120 * e).toFixed(1) + 'px,0)';
        heroText.style.opacity = (1 - 0.55 * e).toFixed(3);
        quickForm.style.transform = 'translate3d(0,' + (-56 * e).toFixed(1) + 'px,0)';
        hero.dataset.progress = p.toFixed(3);
      }

      /* Interni: leggera profondità */
      var cr = cabin.getBoundingClientRect();
      if (!reduce && cr.bottom > 0 && cr.top < vh) {
        var p = (vh - cr.top) / (vh + cr.height);
        cabinImg.style.transform = 'translate3d(0,' + ((p - 0.5) * -60).toFixed(1) + 'px,0)';
      } else if (reduce) cabinImg.style.transform = '';

      /* Come funziona: la linea si riempie e i passi si accendono */
      var hr = howSteps.getBoundingClientRect();
      var prog = Math.min(1, Math.max(0, (vh * 0.6 - hr.top) / hr.height));
      howSteps.style.setProperty('--how-progress', prog.toFixed(3));
      howItems.forEach(function (it) {
        var r = it.getBoundingClientRect();
        it.classList.toggle('is-active', r.top < vh * 0.62);
      });

      /* Barra "Prenota" sul telefono: solo dopo l'apertura e lontano dal modulo */
      var br = booking.getBoundingClientRect(), fr = footer.getBoundingClientRect();
      var show = y > hero.offsetHeight * 0.7 && !(br.top < vh && br.bottom > 0) && fr.top > vh;
      if (cta.classList.contains('is-visible') !== show) {
        cta.classList.toggle('is-visible', show);
        cta.setAttribute('aria-hidden', String(!show));
        ctaLink.tabIndex = show ? 0 : -1;
      }
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function () { updateScene(); onScroll(); });

    /* Interruttore "Disattiva le animazioni" nel piè di pagina, ricordato su questo browser */
    var root = document.documentElement, animBtn = $('.anim');
    function setAnimLabel() {
      animBtn.textContent = root.classList.contains('no-motion') ? 'Riattiva le animazioni' : 'Disattiva le animazioni';
    }
    animBtn.addEventListener('click', function () {
      var off = !root.classList.contains('no-motion');
      root.classList.toggle('no-motion', off);
      try { localStorage.setItem('veladrive-animazioni', off ? 'off' : 'on'); } catch (err) { /* resta solo per questa visita */ }
      refreshMotion();
      setAnimLabel();
      onMotionChange();
    });
    onMotionChange = function () {
      updateScene();
      if (reduce) { heroMedia.style.transform = ''; cabinImg.style.transform = ''; }
      frame();
    };
    setAnimLabel();
    updateScene();
    frame();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
