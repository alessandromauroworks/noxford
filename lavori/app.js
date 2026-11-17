/* Pagine progetto delle app: i pulsanti Stile A/B/C e Scuro cambiano le schermate nelle cornici iPhone
   e il link "Apri la demo". Il visore (schermate.js) legge sempre l'immagine del pulsante. */
(function () {
  "use strict";
  var d = document, ul = d.querySelector(".schermate.app"), gruppo = d.querySelector(".g-stili");
  if (!ul || !gruppo) return;
  var n = ul.getAttribute("data-n"), tit = ul.getAttribute("data-t"), apri = d.getElementById("apri-demo");
  function scegli(s) {
    var b0 = gruppo.querySelector('[data-s="' + s + '"]');
    var nome = b0 ? b0.getAttribute("data-nome") : s;
    gruppo.querySelectorAll("button").forEach(function (b) { b.setAttribute("aria-pressed", b === b0 ? "true" : "false"); });
    ul.querySelectorAll("button").forEach(function (b) {
      var i = b.getAttribute("data-i"), img = b.querySelector(".ip18 img");
      img.src = "../../assets/lavori/" + n + "-m-" + s + "-" + i + ".webp";
      img.alt = tit + ", " + nome + ", schermata: " + b.querySelector(".lb").textContent;
      b.querySelector(".ip18").classList.toggle("scuro", s === "s");
    });
    if (apri) apri.href = "../../demo/" + n + "/?stile=" + (s === "s" ? "a" : s) + "&tema=" + (s === "s" ? "scuro" : "chiaro");
  }
  gruppo.addEventListener("click", function (e) { var b = e.target.closest("button"); if (b) scegli(b.getAttribute("data-s")); });
})();
