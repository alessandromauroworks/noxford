/* Pagine progetto dei gestionali: i pulsanti Stile A/B/C/D e Mobile cambiano le schermate mostrate
   (cornice 16:9 per gli stili, iPhone per Mobile) e il link "Apri la demo".
   Il visore (schermate.js) legge sempre la prima immagine del pulsante: con Mobile le diamo l'immagine da telefono. */
(function () {
  "use strict";
  var d = document, ul = d.querySelector(".schermate.gs"), gruppo = d.querySelector(".g-stili");
  if (!ul || !gruppo) return;
  var n = ul.getAttribute("data-n"), tit = ul.getAttribute("data-t"), apri = d.getElementById("apri-demo");
  var NOMI = { a: "stile A", b: "stile B", c: "stile C", d: "stile D", m: "versione da telefono" };
  var TEMA = { a: "chiaro", b: "chiaro", c: "scuro", d: "chiaro", m: "chiaro" };
  function scegli(s) {
    gruppo.querySelectorAll("button").forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-s") === s ? "true" : "false"); });
    ul.classList.toggle("tel-on", s === "m");
    ul.querySelectorAll("button").forEach(function (b) {
      var i = b.getAttribute("data-i"), img = b.querySelector(".fr169 img"), nome = b.querySelector(".lb").textContent;
      img.src = "../../assets/lavori/gest-" + n + "-" + s + "-" + i + ".webp";
      img.width = s === "m" ? 540 : 1600; img.height = s === "m" ? 1170 : 900;
      img.alt = tit + ", " + NOMI[s] + ", schermata: " + nome;
    });
    if (apri) apri.href = "../../demo/gestionale/?nicchia=" + n + "&stile=" + (s === "m" ? "a" : s) + "&tema=" + TEMA[s];
  }
  gruppo.addEventListener("click", function (e) { var b = e.target.closest("button"); if (b) scegli(b.getAttribute("data-s")); });
})();
