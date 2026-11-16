/* Noxford Agency - pannelli dei servizi e "Chi siamo" (16/11/2026). Nessuna libreria esterna.
   - Sul telefono: un servizio alla volta (barra in alto) e "Vedi tutte" per le funzioni.
   - Video Factory: il video parte solo quando è sullo schermo.
   - Mosaico di "Chi siamo": scorre piano e si sposta con lo scorrimento della pagina.
   Con "Disattiva le animazioni" (html.no-anim) o "riduci movimento" tutto resta fermo e acceso. */
(function () {
  "use strict";
  var d = document, root = d.documentElement, W = window;
  var mq = W.matchMedia ? W.matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };
  var prova = /[?&]movimento=1/.test(location.search); /* solo per il collaudo */
  function spento() { return root.classList.contains("no-anim"); }
  function piano() { return spento() || (mq.matches && !prova); }
  var io = "IntersectionObserver" in W;

  /* ---------- telefono (sotto 760 px): un servizio alla volta e al massimo 3 funzioni ----------
     Senza JavaScript, o sul computer, si vedono tutti i pannelli e tutte le funzioni. */
  var stretto = W.matchMedia ? W.matchMedia("(max-width: 759px)") : { matches: false };
  var lista = d.querySelector(".spn-l"), barra = d.querySelector(".spn-bar");
  var pannelli = lista ? [].slice.call(lista.querySelectorAll(".spn")) : [];
  var bottoni = barra ? [].slice.call(barra.querySelectorAll("button")) : [];
  var attivo = pannelli.length ? pannelli[0].id : null;

  function mostra(id) {
    attivo = id;
    pannelli.forEach(function (p) {
      if (stretto.matches && p.id !== id) p.setAttribute("data-off", ""); else p.removeAttribute("data-off");
    });
    bottoni.forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-sv") === id ? "true" : "false"); });
    W.dispatchEvent(new Event("scroll")); /* fa partire chat e comparse del pannello appena mostrato */
  }
  function impagina() {
    if (!lista) return;
    var tel = stretto.matches;
    lista.classList.toggle("una", tel);
    if (barra) barra.hidden = !tel;
    d.querySelectorAll(".spn-tutte").forEach(function (bt) {
      var ul = d.getElementById(bt.getAttribute("aria-controls"));
      if (!ul) return;
      var tante = ul.children.length > 3;
      bt.hidden = !tel || !tante;
      var aperta = bt.getAttribute("aria-expanded") === "true";
      ul.classList.toggle("corta", tel && tante && !aperta);
    });
    mostra(attivo);
  }
  bottoni.forEach(function (b) {
    b.addEventListener("click", function () {
      var id = b.getAttribute("data-sv");
      mostra(id);
      var p = d.getElementById(id);
      if (p) p.classList.add("in");
      /* se il pannello parte sopra lo schermo, torna alla barra */
      var r = barra.getBoundingClientRect();
      if (r.top < 0) W.scrollTo({ top: W.pageYOffset + r.top - 80, behavior: piano() ? "auto" : "smooth" });
    });
  });
  /* frecce sinistra/destra nella barra */
  if (barra) barra.addEventListener("keydown", function (e) {
    var i = bottoni.indexOf(d.activeElement);
    if (i < 0 || (e.key !== "ArrowRight" && e.key !== "ArrowLeft")) return;
    e.preventDefault();
    var j = (i + (e.key === "ArrowRight" ? 1 : bottoni.length - 1)) % bottoni.length;
    bottoni[j].focus(); bottoni[j].click();
  });
  d.querySelectorAll(".spn-tutte").forEach(function (bt) {
    var testo = bt.textContent;
    bt.addEventListener("click", function () {
      var ul = d.getElementById(bt.getAttribute("aria-controls"));
      var aperta = bt.getAttribute("aria-expanded") !== "true";
      bt.setAttribute("aria-expanded", aperta ? "true" : "false");
      bt.textContent = aperta ? "Mostra meno" : testo;
      if (ul) ul.classList.toggle("corta", !aperta);
    });
  });
  if (stretto.addEventListener) stretto.addEventListener("change", impagina);
  impagina();

  /* ---------- video vero nel pannello Video Factory ----------
     Il file si scarica solo la prima volta che il pannello è sullo schermo; esce dallo schermo = pausa.
     Con meno movimento o animazioni spente resta il fotogramma fisso (poster). */
  d.querySelectorAll(".spn-vid video[data-src]").forEach(function (v) {
    var visto = false;
    v.muted = true;
    function aggiorna() {
      if (!visto || piano() || d.hidden) { if (!v.paused) v.pause(); return; }
      if (!v.getAttribute("src")) { v.src = v.getAttribute("data-src"); }
      var pr = v.play();
      if (pr && pr.catch) pr.catch(function () {});
    }
    if (io) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) { visto = e.isIntersecting; aggiorna(); });
      }, { threshold: 0.25 }).observe(v);
    }
    d.addEventListener("visibilitychange", aggiorna);
    if (mq.addEventListener) mq.addEventListener("change", aggiorna);
    d.addEventListener("click", function (e) { if (e.target.closest && e.target.closest(".anim")) setTimeout(aggiorna, 0); });
  });

  /* ---------- Chi siamo: mosaico ---------- */
  var st = d.querySelector(".chi-st");
  if (!st) return;
  var cols = st.querySelectorAll(".chi-col");
  var vel = [-46, 34, -26];
  if (io) {
    new IntersectionObserver(function (es) {
      es.forEach(function (e) { st.classList.toggle("vivo", e.isIntersecting); });
    }).observe(st);
  } else { st.classList.add("vivo"); }

  var attesa = false;
  function sposta() {
    attesa = false;
    if (piano()) { cols.forEach(function (c) { c.style.setProperty("--py", "0px"); }); return; }
    var r = st.getBoundingClientRect(), vh = W.innerHeight || 800;
    if (r.bottom < -100 || r.top > vh + 100) return;
    /* -1 quando il riquadro entra dal basso, +1 quando esce in alto */
    var q = Math.max(-1, Math.min(1, ((vh / 2) - (r.top + r.height / 2)) / (vh / 2 + r.height / 2)));
    cols.forEach(function (c, i) { c.style.setProperty("--py", (q * vel[i % vel.length]).toFixed(1) + "px"); });
  }
  function chiedi() { if (!attesa) { attesa = true; requestAnimationFrame(sposta); } }
  W.addEventListener("scroll", chiedi, { passive: true });
  W.addEventListener("resize", chiedi);
  sposta();
})();
