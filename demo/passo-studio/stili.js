/* Selettore dello stile grafico della demo (A, B, C). Si sceglie con ?stile=a|b|c, nessun dato esce dal browser. */
(function () {
  'use strict';
  var h = document.documentElement, m = /[?&]stile=([abc])/.exec(location.search), s = m ? m[1] : 'a';
  h.setAttribute('data-stile', s);
  var NOMI = { a: 'Pulito', b: 'Vetro', c: h.getAttribute('data-stile-c') || 'Scuro' };
  function barra() {
    var strip = document.querySelector('.demo-strip'); if (!strip || document.querySelector('.stili')) return;
    var n = document.createElement('nav'); n.className = 'stili'; n.setAttribute('aria-label', 'Stile grafico della demo');
    n.innerHTML = '<span>Stile</span>' + ['a', 'b', 'c'].map(function (k) { return '<a href="?stile=' + k + location.hash + '" data-st="' + k + '"' + (k === s ? ' aria-current="true"' : '') + '><b>' + k.toUpperCase() + '</b>&nbsp;' + NOMI[k] + '</a>'; }).join('');
    strip.insertAdjacentElement('afterend', n);
    window.addEventListener('hashchange', function () { [].forEach.call(n.querySelectorAll('a'), function (a) { a.setAttribute('href', '?stile=' + a.dataset.st + location.hash); }); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', barra); else barra();
})();
