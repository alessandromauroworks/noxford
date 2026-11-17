/* Noxford Agency - home, "Per il tuo settore": filtro per area. Senza script si vedono tutti i settori. */
(function () {
  "use strict";
  var d = document, bar = d.querySelector(".st-bar");
  if (!bar) return;
  var bottoni = [].slice.call(bar.querySelectorAll("button"));
  var aree = [].slice.call(d.querySelectorAll(".st-area"));
  var stato = d.getElementById("st-stato");
  bar.hidden = false;
  bottoni.forEach(function (b) {
    b.addEventListener("click", function () {
      var a = b.getAttribute("data-a");
      bottoni.forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      aree.forEach(function (el) {
        var ok = a === "tutti" || el.getAttribute("data-a") === a;
        el.hidden = !ok;
        if (ok) el.classList.add("in");
      });
      if (stato) stato.textContent = "Mostro: " + b.childNodes[0].textContent.trim();
      if (b.scrollIntoView && bar.scrollWidth > bar.clientWidth) b.scrollIntoView({ block: "nearest", inline: "center" });
    });
  });
})();
