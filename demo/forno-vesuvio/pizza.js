/* Forno Vesuvio - la pizza disegnata: base fotografata + strati in SVG.
   Ogni ingrediente è disegnato a mano in SVG e cade sulla pizza quando lo scegli. */
(function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";
  var C = 200; // centro del disegno (viewBox 0 0 400 400)

  // ---------- casualità ripetibile: stessi pezzi negli stessi punti ----------
  function seme(str) { var h = 2166136261; for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(s) { var a = seme(String(s)); return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function f(n) { return Math.round(n * 10) / 10; }

  // contorno morbido e irregolare (Catmull-Rom -> Bezier)
  function macchia(r, n, jit, sx, sy, rand) {
    var p = [];
    for (var i = 0; i < n; i++) {
      var a = i / n * Math.PI * 2, rr = r * (1 - jit + rand() * 2 * jit);
      p.push([Math.cos(a) * rr * (sx || 1), Math.sin(a) * rr * (sy || 1)]);
    }
    var d = "M" + f(p[0][0]) + " " + f(p[0][1]);
    for (var j = 0; j < n; j++) {
      var p0 = p[(j - 1 + n) % n], p1 = p[j], p2 = p[(j + 1) % n], p3 = p[(j + 2) % n];
      d += "C" + f(p1[0] + (p2[0] - p0[0]) / 6) + " " + f(p1[1] + (p2[1] - p0[1]) / 6) + " " +
        f(p2[0] - (p3[0] - p1[0]) / 6) + " " + f(p2[1] - (p3[1] - p1[1]) / 6) + " " + f(p2[0]) + " " + f(p2[1]);
    }
    return d + "Z";
  }

  // ---------- definizioni comuni (una volta sola nella pagina) ----------
  var DEFS = '<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>' +
    '<radialGradient id="fvSugo" cx="45%" cy="42%" r="62%"><stop offset="0" stop-color="#d23a24"/><stop offset=".7" stop-color="#bf2d1b"/><stop offset="1" stop-color="#a52416"/></radialGradient>' +
    '<radialGradient id="fvGiallo" cx="45%" cy="42%" r="62%"><stop offset="0" stop-color="#f6c043"/><stop offset=".75" stop-color="#eca629"/><stop offset="1" stop-color="#d98a17"/></radialGradient>' +
    '<radialGradient id="fvMozz" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#fffdf7"/><stop offset=".55" stop-color="#f6eedd"/><stop offset=".85" stop-color="#ead9b8"/><stop offset="1" stop-color="#e0c79c" stop-opacity=".85"/></radialGradient>' +
    '<radialGradient id="fvBufala" cx="38%" cy="32%" r="72%"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#fbf8f1"/><stop offset="1" stop-color="#ece6d8"/></radialGradient>' +
    '<radialGradient id="fvProvola" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#fbf1d8"/><stop offset=".7" stop-color="#f1dfb3"/><stop offset="1" stop-color="#d9b57a"/></radialGradient>' +
    '<radialGradient id="fvSalame" cx="42%" cy="38%" r="65%"><stop offset="0" stop-color="#c9393a"/><stop offset=".7" stop-color="#a8242a"/><stop offset="1" stop-color="#7c151b"/></radialGradient>' +
    '<radialGradient id="fvCotto" cx="40%" cy="40%" r="70%"><stop offset="0" stop-color="#f6b7ac"/><stop offset="1" stop-color="#e48f86"/></radialGradient>' +
    '<radialGradient id="fvNduja" cx="40%" cy="40%" r="70%"><stop offset="0" stop-color="#d8512a"/><stop offset="1" stop-color="#9c2a12"/></radialGradient>' +
    '<radialGradient id="fvSalsiccia" cx="35%" cy="35%" r="75%"><stop offset="0" stop-color="#c08a66"/><stop offset=".6" stop-color="#9a6446"/><stop offset="1" stop-color="#6f4430"/></radialGradient>' +
    '<linearGradient id="fvBasilico" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5fae45"/><stop offset="1" stop-color="#2c6a22"/></linearGradient>' +
    '<radialGradient id="fvTostato" cx="50%" cy="50%" r="50%"><stop offset=".72" stop-color="#8a4a12" stop-opacity="0"/><stop offset=".9" stop-color="#9b5a1c" stop-opacity=".45"/><stop offset="1" stop-color="#6d3a0e" stop-opacity=".7"/></radialGradient>' +
    '<filter id="fvBordo" x="-15%" y="-15%" width="130%" height="130%"><feTurbulence type="turbulence" baseFrequency="0.028" numOctaves="2" seed="7" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="18" xChannelSelector="R" yChannelSelector="G" result="d"/>' +
    '<feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="2" seed="3" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 .36  0 0 0 0 .05  0 0 0 0 .02  0 0 0 -2.4 1.35" result="nc"/><feComposite in="nc" in2="d" operator="in" result="ni"/><feMerge><feMergeNode in="d"/><feMergeNode in="ni"/></feMerge></filter>' +
    '<filter id="fvMorbido" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="11" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="5" xChannelSelector="R" yChannelSelector="G" result="d"/><feGaussianBlur in="d" stdDeviation=".35"/></filter>' +
    '<filter id="fvOmbra" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="1.6" stdDeviation="1.3" flood-color="#2a0e04" flood-opacity=".38"/></filter>' +
    '</defs></svg>';
  function assicuraDefs() {
    if (document.getElementById("fvDefs")) return;
    var d = document.createElement("div"); d.id = "fvDefs"; d.innerHTML = DEFS;
    document.body.appendChild(d);
  }

  // ---------- i pezzi, disegnati uno per uno ----------
  var PEZZO = {
    fiordilatte: function (R) { return '<g filter="url(#fvMorbido)"><path d="' + macchia(19 + R() * 6, 9, .24, 1.1, .95, R) + '" fill="url(#fvMozz)"/><path d="M' + f(-8 + R() * 4) + ' -4C-3 -8 4 -8 8 -3" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".7"/><path d="M-6 6C-2 8 3 8 7 5" fill="none" stroke="#e2cfa8" stroke-width="1.2" stroke-linecap="round" opacity=".7"/></g>'; },
    bufala: function (R) { return '<g filter="url(#fvMorbido)"><path d="' + macchia(25 + R() * 6, 10, .18, 1.05, 1, R) + '" fill="url(#fvBufala)" stroke="#e8e1d2" stroke-width=".6"/><path d="M-10 -6 C-4 -12 6 -11 10 -5" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/></g>'; },
    provola: function (R) { return '<g filter="url(#fvMorbido)"><path d="' + macchia(18 + R() * 5, 9, .24, 1.1, .95, R) + '" fill="url(#fvProvola)" stroke="#c49152" stroke-width=".9" stroke-opacity=".6"/><circle cx="3" cy="2" r="3" fill="#d2a565" opacity=".35"/></g>'; },
    salame: function (R) {
      var r = 14 + R() * 3, s = '<ellipse rx="' + f(r) + '" ry="' + f(r * .93) + '" fill="url(#fvSalame)" stroke="#5b0e12" stroke-width="1.3"/>';
      for (var i = 0; i < 8; i++) { var a = R() * 6.28, d = R() * r * .72; s += '<circle cx="' + f(Math.cos(a) * d) + '" cy="' + f(Math.sin(a) * d) + '" r="' + f(.8 + R() * 1.1) + '" fill="#f4c7bb" opacity=".9"/>'; }
      return s + '<path d="M' + f(-r * .7) + ' ' + f(-r * .45) + ' A' + f(r * .85) + ' ' + f(r * .85) + ' 0 0 1 ' + f(r * .35) + ' ' + f(-r * .78) + '" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="2" stroke-linecap="round"/>';
    },
    prosciutto: function (R) { return '<path d="' + macchia(16 + R() * 4, 9, .26, 1.35, .9, R) + '" fill="url(#fvCotto)" stroke="#f9ddd3" stroke-width="3.2" stroke-linejoin="round"/><path d="M-12 2 C-4 -4 5 -3 12 1" fill="none" stroke="#fbd3c9" stroke-width="1.6" stroke-linecap="round" opacity=".8"/>'; },
    nduja: function (R) { return '<path d="' + macchia(13, 8, .3, 1.2, 1, R) + '" fill="#d4552c" opacity=".28"/><path d="' + macchia(8 + R() * 2, 8, .34, 1.1, 1, R) + '" fill="url(#fvNduja)"/>'; },
    salsiccia: function (R) { return '<path d="' + macchia(6.5 + R() * 3, 8, .3, 1.1, 1, R) + '" fill="url(#fvSalsiccia)" stroke="#5e3826" stroke-width=".6"/><circle cx="-2" cy="-2" r="1.2" fill="#d9ab88"/><circle cx="2.5" cy="1.5" r=".9" fill="#d9ab88"/>'; },
    funghi: function () { return '<path d="M-15 2C-15-13 15-13 15 2C10 3 7.5 3 6 3L5 13Q0 15.5-5 13L-6 3C-7.5 3-10 3-15 2Z" fill="#eedfc4" stroke="#b08a60" stroke-width="1"/><path d="M-11 0C-8-7 8-7 11 0" fill="none" stroke="#cdb089" stroke-width="1.2"/><path d="M-15 2C-15-13 15-13 15 2" fill="none" stroke="#8a6440" stroke-width="2.4" stroke-linecap="round"/>'; },
    peperoni: function (R, i) {
      var col = i % 3 === 1 ? ["#efb126", "#fde38a"] : ["#cf2f25", "#f58a7a"], b = f(-6 - R() * 5);
      return '<path d="M-15 2Q0 ' + b + ' 15 2" fill="none" stroke="' + col[0] + '" stroke-width="6.5" stroke-linecap="round"/><path d="M-12 0Q0 ' + f(b - 1.6) + ' 12 0" fill="none" stroke="' + col[1] + '" stroke-width="1.5" stroke-linecap="round" opacity=".7"/>';
    },
    cipolla: function () { return '<path d="M-11 0A11 11 0 1 1 6 9.3" fill="none" stroke="#8e2f6d" stroke-width="2.8" stroke-linecap="round"/><path d="M-11 0A11 11 0 1 1 6 9.3" fill="none" stroke="#ecc9de" stroke-width="1" stroke-linecap="round"/><path d="M-6 0A6 6 0 1 1 4 4.6" fill="none" stroke="#9e3c7b" stroke-width="2.2" stroke-linecap="round"/>'; },
    carciofi: function () {
      var s = "";
      [-34, -12, 12, 34, 0].forEach(function (g, k) { s += '<path transform="rotate(' + g + ')" d="M0 10C-6 2-5.5-10 0-15C5.5-10 6 2 0 10Z" fill="' + (k % 2 ? "#a9b76c" : "#8f9e52") + '" stroke="#64733a" stroke-width=".8"/>'; });
      return s + '<circle cy="-12" r="1.6" fill="#7b587a"/>';
    },
    friarielli: function (R) {
      var s = "";
      for (var k = 0; k < 4; k++) { var g = R() * 360, dx = f((R() - .5) * 10), dy = f((R() - .5) * 10); s += '<g transform="translate(' + dx + ' ' + dy + ') rotate(' + f(g) + ')"><path d="' + macchia(6.5, 8, .28, 1.7, .9, R) + '" fill="' + (k % 2 ? "#3d7530" : "#2c5822") + '"/><path d="M-10 0L10 0" stroke="#79a65a" stroke-width="1.2" stroke-linecap="round"/></g>'; }
      return s;
    },
    pomodorini: function () { return '<circle r="9.5" fill="#c4261d"/><circle r="7.3" fill="#e8553c"/><ellipse cx="0" cy="-3.8" rx="2.6" ry="1.7" fill="#f7b45c"/><ellipse transform="rotate(120)" cx="0" cy="-3.8" rx="2.6" ry="1.7" fill="#f7b45c"/><ellipse transform="rotate(240)" cx="0" cy="-3.8" rx="2.6" ry="1.7" fill="#f7b45c"/><circle r="1.6" fill="#f3a074"/><path d="M-6-4A7 7 0 0 1-1-7" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="1.4" stroke-linecap="round"/>'; },
    olive: function () { return '<path d="M0-6.6A6.6 6.6 0 1 1 0 6.6A6.6 6.6 0 1 1 0-6.6ZM0-2.5A2.5 2.5 0 1 0 0 2.5A2.5 2.5 0 1 0 0-2.5Z" fill="#2b1a21" fill-rule="evenodd"/><path d="M-4.6-2.6A5.2 5.2 0 0 1-1-5" fill="none" stroke="#fff" stroke-opacity=".38" stroke-width="1.2" stroke-linecap="round"/>'; },
    acciughe: function () { return '<path d="M-17 0C-10-3.3 10-3.3 17 0C10 3 -10 3-17 0Z" fill="#7a4b3c"/><path d="M-14-.6C-6-2 6-2 14-.6" fill="none" stroke="#d6cec5" stroke-width="1" opacity=".85"/>'; },
    ricotta: function (R) { return '<path d="' + macchia(10 + R() * 3, 9, .2, 1.05, 1, R) + '" fill="#fffdf6" stroke="#e2dbca" stroke-width="1"/><path d="M-4 0C-4-4 4-4 4 0C4 3-1 3-1 0" fill="none" stroke="#e9e2d2" stroke-width="1.2" stroke-linecap="round"/>'; },
    basilico: function () { return '<path d="M0-15C9-10 10 6 0 15C-10 6-9-10 0-15Z" fill="url(#fvBasilico)"/><path d="M0-12L0 12M0-4L5-8M0-4L-5-8M0 3L5-1M0 3L-5-1" stroke="#a6d98a" stroke-width=".8" stroke-linecap="round" opacity=".6"/>'; },
    rucola: function () { return '<path d="M0-13L3-9L6-10L4-5L7-3L3 0L6 4L2 6L3 11L0 13L-3 11L-2 6L-6 4L-3 0L-7-3L-4-5L-6-10L-3-9Z" fill="#4a8a2c" stroke="#36671f" stroke-width=".6" stroke-linejoin="round"/><path d="M0-11L0 12" stroke="#8cc068" stroke-width=".7"/>'; }
  };
  var QUANTI_FORMAGGIO = { fiordilatte: 11, bufala: 7, provola: 11 };

  // posizioni a girasole con un po' di disordine
  function posizioni(id, n, raggio) {
    var R = rng("pos-" + id), fase = R() * 6.28, out = [];
    for (var i = 0; i < n; i++) {
      var r = raggio * Math.sqrt((i + .5) / n), a = i * 2.39996 + fase;
      out.push({ x: f(C + Math.cos(a) * r + (R() - .5) * 14), y: f(C + Math.sin(a) * r + (R() - .5) * 14), rot: f(R() * 360), sc: f(.88 + R() * .28) });
    }
    return out;
  }

  function pezziDi(id, n, raggio, anima) {
    var R = rng("forma-" + id), pos = posizioni(id, n, raggio), s = "";
    pos.forEach(function (p, i) {
      var dentro = PEZZO[id](R, i);
      s += '<g transform="translate(' + p.x + ' ' + p.y + ') rotate(' + p.rot + ') scale(' + p.sc + ')">' +
        (anima ? '<g class="cade" style="--d:' + (i * 38) + 'ms">' + dentro + '</g>' : dentro) + '</g>';
    });
    return s;
  }

  function salsaSvg(id) {
    if (id === "bianca") {
      var R = rng("olio"), s = '<circle cx="200" cy="200" r="146" fill="#f3d37a" opacity=".22" filter="url(#fvBordo)"/>';
      for (var i = 0; i < 14; i++) { var a = R() * 6.28, d = R() * 120; s += '<ellipse cx="' + f(C + Math.cos(a) * d) + '" cy="' + f(C + Math.sin(a) * d) + '" rx="' + f(3 + R() * 6) + '" ry="' + f(2 + R() * 3) + '" fill="#e9b63a" opacity=".35"/>'; }
      return s;
    }
    var R2 = rng("sugo-" + id), out = '<circle cx="200" cy="200" r="148" fill="url(#' + (id === "giallo" ? "fvGiallo" : "fvSugo") + ')" filter="url(#fvBordo)"/>';
    for (var j = 0; j < 34; j++) {
      var b = R2() * 6.28, dd = Math.sqrt(R2()) * 128;
      out += '<path transform="translate(' + f(C + Math.cos(b) * dd) + ' ' + f(C + Math.sin(b) * dd) + ')" d="' + macchia(2 + R2() * 4, 6, .35, 1.3, 1, R2) + '" fill="' + (id === "giallo" ? (j % 2 ? "#f9d270" : "#d98b16") : (j % 2 ? "#e0533a" : "#9e2214")) + '" opacity=".55"/>';
    }
    return out;
  }

  function crusca() {
    var R = rng("crusca"), s = "";
    for (var i = 0; i < 150; i++) { var a = R() * 6.28, d = Math.sqrt(R()) * 190; s += '<ellipse cx="' + f(C + Math.cos(a) * d) + '" cy="' + f(C + Math.sin(a) * d) + '" rx="' + f(.8 + R() * 1.3) + '" ry=".7" transform="rotate(' + f(R() * 180) + ' ' + f(C + Math.cos(a) * d) + ' ' + f(C + Math.sin(a) * d) + ')" fill="#6e4521" opacity=".55"/>'; }
    return s;
  }

  function tagli() {
    var s = "";
    for (var k = 0; k < 4; k++) { var a = k * Math.PI / 4; s += '<line x1="' + f(C - Math.cos(a) * 192) + '" y1="' + f(C - Math.sin(a) * 192) + '" x2="' + f(C + Math.cos(a) * 192) + '" y2="' + f(C + Math.sin(a) * 192) + '" stroke="#3b1d0c" stroke-opacity=".32" stroke-width="1.4"/>'; }
    return s;
  }

  function ordinati(top) {
    return FV.COMPONI.ingredienti.map(function (i) { return i.id; }).filter(function (id) { return top.indexOf(id) >= 0; });
  }
  function nPezzi(id) { var i = FV.trova(FV.COMPONI.ingredienti, id); return i ? i.n : 8; }

  // ---------- pizza viva (Componi) ----------
  function crea(contenitore) {
    assicuraDefs();
    contenitore.innerHTML = '<svg class="pz" viewBox="0 0 400 400" role="img" aria-label="Anteprima della tua pizza">' +
      '<g class="pz-tutta"><image class="pz-impasto" href="img/impasto.webp" x="0" y="0" width="400" height="400"/>' +
      '<g class="pz-crusca"></g><circle class="pz-tostato" cx="200" cy="200" r="199" fill="url(#fvTostato)"/>' +
      '<g class="pz-salsa"></g><g class="pz-formaggio" filter="url(#fvOmbra)"></g><g class="pz-top" filter="url(#fvOmbra)"></g><g class="pz-tagli"></g></g></svg>';
    var svg = contenitore.firstChild, el = function (c) { return svg.querySelector(c); };
    el(".pz-crusca").innerHTML = crusca();
    el(".pz-tagli").innerHTML = tagli();
    var prima = { salsa: null, formaggio: null, top: [] };

    function aggiorna(s, anima) {
      var tutta = el(".pz-tutta");
      tutta.style.transform = "scale(" + FV.trova(FV.COMPONI.misure, s.misura).scala + ")";
      svg.setAttribute("data-impasto", s.impasto);
      svg.setAttribute("data-cottura", s.cottura);

      if (s.salsa !== prima.salsa) {
        var g = el(".pz-salsa");
        g.innerHTML = '<g class="' + (anima ? "spalma" : "") + '">' + salsaSvg(s.salsa) + '</g>';
      }
      if (s.formaggio !== prima.formaggio) {
        var gf = el(".pz-formaggio");
        gf.innerHTML = s.formaggio === "nessuno" ? "" : pezziDi(s.formaggio, QUANTI_FORMAGGIO[s.formaggio], 118, anima);
      }
      var gt = el(".pz-top");
      // togli quelli non più scelti
      Array.prototype.slice.call(gt.children).forEach(function (n) {
        var id = n.getAttribute("data-ing");
        if (s.top.indexOf(id) < 0 && !n.classList.contains("via")) {
          if (anima) { n.classList.add("via"); setTimeout(function () { if (n.parentNode) n.parentNode.removeChild(n); }, 320); }
          else gt.removeChild(n);
        }
      });
      // aggiungi i nuovi nel loro strato
      ordinati(s.top).forEach(function (id) {
        if (gt.querySelector('[data-ing="' + id + '"]:not(.via)')) return;
        var nuovo = document.createElementNS(NS, "g");
        nuovo.setAttribute("data-ing", id);
        nuovo.innerHTML = pezziDi(id, nPezzi(id), 128, anima);
        var dopo = null, ordine = FV.COMPONI.ingredienti.map(function (i) { return i.id; });
        Array.prototype.slice.call(gt.children).some(function (n) {
          if (ordine.indexOf(n.getAttribute("data-ing")) > ordine.indexOf(id)) { dopo = n; return true; } return false;
        });
        gt.insertBefore(nuovo, dopo);
      });
      prima = { salsa: s.salsa, formaggio: s.formaggio, top: s.top.slice() };
    }
    return { aggiorna: aggiorna, svg: svg };
  }

  // ---------- pizza ferma (carrello, pannello, menu) ----------
  function statica(s, etichetta) {
    assicuraDefs();
    var sc = s.misura ? FV.trova(FV.COMPONI.misure, s.misura).scala : 1;
    var top = ordinati(s.top || []).map(function (id) { return pezziDi(id, nPezzi(id), 128, false); }).join("");
    return '<svg class="pz pz-mini" viewBox="0 0 400 400" role="img" aria-label="' + (etichetta || "Pizza") + '" data-impasto="' + (s.impasto || "classico") + '" data-cottura="' + (s.cottura || "classica") + '">' +
      '<g transform="translate(200 200) scale(' + sc + ') translate(-200 -200)"><image class="pz-impasto" href="img/impasto.webp" x="0" y="0" width="400" height="400"/>' +
      (s.impasto === "integrale" ? crusca() : "") + '<circle class="pz-tostato" cx="200" cy="200" r="199" fill="url(#fvTostato)"/>' +
      salsaSvg(s.salsa || "rossa") + (s.formaggio && s.formaggio !== "nessuno" ? pezziDi(s.formaggio, QUANTI_FORMAGGIO[s.formaggio], 118, false) : "") + top + '</g></svg>';
  }

  // icona di un ingrediente (per le tessere di scelta)
  function icona(id) {
    assicuraDefs();
    var R = rng("icona-" + id), dentro = "";
    if (["olive", "salsiccia", "nduja", "rucola"].indexOf(id) >= 0) {
      [[-7, -5, 20], [7, -3, 140], [0, 7, 260]].forEach(function (p, i) { dentro += '<g transform="translate(' + p[0] + ' ' + p[1] + ') rotate(' + p[2] + ') scale(.82)">' + PEZZO[id](R, i) + '</g>'; });
    } else if (PEZZO[id]) dentro = '<g transform="rotate(' + (id === "acciughe" || id === "peperoni" ? -25 : 0) + ')">' + PEZZO[id](R, 0) + '</g>';
    return '<svg class="ico" viewBox="-20 -20 40 40" aria-hidden="true" focusable="false">' + dentro + '</svg>';
  }

  window.FVPizza = { crea: crea, statica: statica, icona: icona };
})();
