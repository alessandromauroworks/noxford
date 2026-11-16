/* Pagine progetto del Portfolio: visore a tutto schermo delle schermate (frecce, tastiera, contatore). */
(function () {
  'use strict';
  var bottoni = [].slice.call(document.querySelectorAll('.schermate button'));
  var v = document.getElementById('visore');
  if (!bottoni.length || !v || typeof v.showModal !== 'function') return;
  var img = document.createElement('img'), conta = v.querySelector('[data-conta]'), i = 0;
  function mostra(n) {
    if (!img.parentNode) v.insertBefore(img, v.querySelector('.vb'));
    i = (n + bottoni.length) % bottoni.length;
    var s = bottoni[i].querySelector('img');
    img.src = s.currentSrc || s.src; img.alt = s.alt;
    conta.textContent = (i + 1) + ' / ' + bottoni.length + ' · ' + bottoni[i].querySelector('span').textContent;
  }
  bottoni.forEach(function (b, n) { b.addEventListener('click', function () { mostra(n); v.showModal(); }); });
  v.querySelector('[data-prev]').addEventListener('click', function (e) { e.stopPropagation(); mostra(i - 1); });
  v.querySelector('[data-next]').addEventListener('click', function (e) { e.stopPropagation(); mostra(i + 1); });
  v.querySelector('.chiudi').addEventListener('click', function () { v.close(); });
  v.addEventListener('click', function (e) { if (e.target === v || e.target === img) v.close(); });
  v.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') mostra(i - 1); if (e.key === 'ArrowRight') mostra(i + 1); });
  v.addEventListener('close', function () { if (bottoni[i]) bottoni[i].focus(); });
})();
