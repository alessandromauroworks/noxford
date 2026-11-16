/* Forno Vesuvio - pannello ordini del titolare (demo, dati solo nel browser). */
(function () {
  "use strict";
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  function esc(t) { return String(t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  var tA;
  function avvisa(t) { var a = $("#avviso"); a.textContent = t; a.classList.add("su"); clearTimeout(tA); tA = setTimeout(function () { a.classList.remove("su"); }, 2400); }

  var filtro = "arrivo", visti = null, ultimaFirma = "";
  var GRUPPI = { arrivo: ["ricevuto"], lavoro: ["preparazione", "forno"], uscita: ["uscita"], chiusi: ["chiuso", "annullato"] };
  var AZIONE = {
    ricevuto: "Inizia a preparare", preparazione: "Metti in forno",
    forno: function (o) { return o.modo === "consegna" ? "Affida al fattorino" : "Pronta: chiama il cliente"; },
    uscita: function (o) { return o.modo === "consegna" ? "Segna come consegnato" : "Segna come ritirato"; }
  };

  function diOggi(o) { return FV.oggiChiave(new Date(o.creato)) === FV.oggiChiave(); }
  function ordiniOggi() { return FV.avanzaAuto().filter(diOggi); }

  function disegna() {
    var tutti = ordiniOggi(), validi = tutti.filter(function (o) { return o.stato !== "annullato"; });
    $("#nOrdini").textContent = validi.length;
    $("#nIncasso").textContent = FV.euro(validi.reduce(function (a, o) { return a + o.totale; }, 0));
    $("#nAttesa").textContent = tutti.filter(function (o) { return o.stato === "ricevuto" || o.stato === "preparazione"; }).length;
    $("#nPizze").textContent = validi.reduce(function (a, o) { return a + o.righe.filter(function (r) { return r.pizza; }).reduce(function (b, r) { return b + r.q; }, 0); }, 0);
    Object.keys(GRUPPI).forEach(function (g) { $('[data-n="' + g + '"]').textContent = tutti.filter(function (o) { return GRUPPI[g].indexOf(o.stato) >= 0; }).length; });

    var lista = tutti.filter(function (o) { return filtro === "tutti" || GRUPPI[filtro].indexOf(o.stato) >= 0; });
    // prima chi va servito prima
    lista.sort(function (a, b) { var x = a.perValore || "", y = b.perValore || ""; return x > y ? 1 : x < y ? -1 : a.creato - b.creato; });
    var firma = filtro + JSON.stringify(tutti.map(function (o) { return o.numero + o.stato + o.auto; })) + Math.floor(Date.now() / 60000);
    if (firma === ultimaFirma) return;
    ultimaFirma = firma;
    var nuovi = visti ? tutti.filter(function (o) { return visti.indexOf(o.numero) < 0; }).map(function (o) { return o.numero; }) : [];
    if (nuovi.length && visti) avvisa(nuovi.length === 1 ? "Nuovo ordine " + nuovi[0] : nuovi.length + " ordini nuovi");
    visti = tutti.map(function (o) { return o.numero; });
    var inArrivo = tutti.filter(function (o) { return o.stato === "ricevuto"; }).length;
    document.title = (inArrivo ? "(" + inArrivo + ") " : "") + "Pannello ordini · Forno Vesuvio (demo)";

    $("#ordini").innerHTML = lista.length ? lista.map(function (o) { return scheda(o, nuovi.indexOf(o.numero) >= 0); }).join("") :
      '<div class="vuoto-pan"><b>Niente qui.</b><p>' + (tutti.length ? "Nessun ordine in questo stato." : 'Ancora nessun ordine oggi. Fanne uno dal <a href="index.html">sito</a> oppure usa "Aggiungi 3 ordini di prova".') + '</p></div>';
  }

  function scheda(o, nuovo) {
    var az = AZIONE[o.stato], testoAz = typeof az === "function" ? az(o) : az;
    var i = FV.STATI.indexOf(o.stato), minuti = Math.round((Date.now() - o.creato) / 60000);
    return '<article class="ord stato-' + o.stato + (nuovo ? " nuovo" : "") + '" data-n="' + o.numero + '">' +
      '<header><b class="ord-num">' + o.numero + '</b><span class="ord-stato">' + FV.nomeStato(o.stato, o.modo) + '</span>' + (o.auto && o.stato !== "chiuso" && o.stato !== "annullato" ? '<span class="ord-auto" title="Avanza da solo per la demo">auto</span>' : "") + '</header>' +
      '<p class="ord-quando"><span class="ord-modo ' + o.modo + '">' + (o.modo === "consegna" ? "Consegna" : "Ritiro") + '</span> ' + esc(o.per) + ' <small>· arrivato ' + (minuti < 1 ? "ora" : minuti + " min fa") + '</small></p>' +
      '<p class="ord-chi"><b>' + esc(o.nome) + '</b> · <a href="tel:' + esc(o.telefono.replace(/[^\d+]/g, "")) + '">' + esc(o.telefono) + '</a>' + (o.indirizzo ? '<br>' + esc(o.indirizzo) + ' <small>(' + esc(o.zona) + ')</small>' : "") + '</p>' +
      '<ul class="ord-righe">' + o.righe.map(function (r) {
        return '<li>' + (r.tipo === "composta" ? '<span class="ord-mini">' + FVPizza.statica(r.composta, "Pizza composta dal cliente") + '</span>' : "") + '<span><b>' + r.q + ' × ' + esc(r.nome) + '</b>' + (FV.descriviRiga(r) ? '<small>' + esc(FV.descriviRiga(r)) + '</small>' : "") + '</span></li>';
      }).join("") + '</ul>' +
      (o.note ? '<p class="ord-note"><b>Note:</b> ' + esc(o.note) + '</p>' : "") +
      '<p class="ord-tot"><span>Da incassare' + (o.consegna ? " (consegna inclusa)" : "") + '</span><b>' + FV.euro(o.totale) + '</b></p>' +
      '<div class="ord-azioni">' +
      (testoAz ? '<button type="button" class="btn pieno" data-az="avanti">' + testoAz + '</button>' : "") +
      (i > 0 && o.stato !== "annullato" ? '<button type="button" class="btn piccolo" data-az="indietro">Indietro</button>' : "") +
      (o.stato !== "chiuso" && o.stato !== "annullato" ? '<button type="button" class="btn piccolo rosso" data-az="annulla">Annulla</button>' : "") +
      (o.stato === "annullato" ? '<button type="button" class="btn piccolo" data-az="ripristina">Ripristina</button>' : "") +
      '</div></article>';
  }

  $("#ordini").addEventListener("click", function (e) {
    var b = e.target.closest("[data-az]"); if (!b) return;
    var num = b.closest(".ord").getAttribute("data-n"), ordini = FV.leggi("ordini", []);
    var o = ordini.filter(function (x) { return x.numero === num; })[0]; if (!o) return;
    var az = b.getAttribute("data-az"), i = FV.STATI.indexOf(o.stato);
    if (az === "annulla" && !confirm("Annullare l'ordine " + num + "? Nella realtà chiameresti il cliente.")) return;
    if (az === "avanti") o.stato = FV.STATI[Math.min(i + 1, FV.STATI.length - 1)];
    if (az === "indietro") o.stato = FV.STATI[Math.max(i - 1, 0)];
    if (az === "annulla") o.stato = "annullato";
    if (az === "ripristina") o.stato = "ricevuto";
    o.auto = false; o.storia.push({ stato: o.stato, t: Date.now() });
    FV.scrivi("ordini", ordini);
    avvisa(num + ": " + FV.nomeStato(o.stato, o.modo).toLowerCase());
    disegna();
  });

  $("#filtri").addEventListener("click", function (e) {
    var b = e.target.closest("[data-f]"); if (!b) return;
    filtro = b.getAttribute("data-f");
    $$("#filtri [data-f]").forEach(function (x) { x.setAttribute("aria-selected", String(x === b)); });
    disegna();
  });

  // ingredienti finiti
  function disegnaFiniti() {
    var fin = FV.leggi("finiti", []);
    $("#finiti").innerHTML = FV.COMPONI.ingredienti.map(function (x) {
      return '<label class="interr"><input type="checkbox" value="' + x.id + '"' + (fin.indexOf(x.id) < 0 ? " checked" : "") + '><span class="lev" aria-hidden="true"></span><span>' + x.nome + '</span></label>';
    }).join("");
  }
  $("#finiti").addEventListener("change", function () {
    var fin = $$("#finiti input").filter(function (i) { return !i.checked; }).map(function (i) { return i.value; });
    FV.scrivi("finiti", fin);
    avvisa(fin.length ? fin.length + (fin.length === 1 ? " ingrediente segnato come finito" : " ingredienti segnati come finiti") : "Tutti gli ingredienti disponibili");
  });

  // impostazioni della demo
  var imp = FV.leggi("impostazioni", { auto: true });
  $("#auto").checked = imp.auto !== false;
  $("#auto").addEventListener("change", function (e) { FV.scrivi("impostazioni", { auto: e.target.checked }); });

  $("#prova").addEventListener("click", function () {
    var ordini = FV.leggi("ordini", []), ora = Date.now();
    var esempi = [
      { modo: "ritiro", nome: "Cliente di prova A", righe: [{ tipo: "menu", id: "margherita", nome: "Margherita", prezzo: 6, q: 2, extra: [], pizza: true }, { tipo: "menu", id: "frittatina", nome: "Frittatina di pasta", prezzo: 3, q: 2, extra: [], pizza: false }] },
      { modo: "consegna", nome: "Cliente di prova B", zona: "Vomero e Arenella", indirizzo: "Via di prova 1 · interno 3", righe: [{ tipo: "composta", nome: "La tua pizza", q: 1, pizza: true, composta: { impasto: "integrale", misura: "maxi", salsa: "rossa", formaggio: "bufala", top: ["salame", "funghi", "olive", "basilico"], cottura: "bencotta" } }, { tipo: "menu", id: "birra", nome: "Birra chiara artigianale 33 cl", prezzo: 4.5, q: 2, extra: [], pizza: false }] },
      { modo: "ritiro", nome: "Cliente di prova C", righe: [{ tipo: "menu", id: "diavola", nome: "Diavola", prezzo: 7.5, q: 1, extra: ["Ben cotta"], pizza: true }] }
    ];
    esempi.forEach(function (e, k) {
      e.righe.forEach(function (r) { if (r.tipo === "composta") r.prezzo = FV.prezzoPizza(r.composta); });
      var f = FV.fasce(e.modo)[k * 2] || { etichetta: "Oggi", ora: "" };
      var sub = e.righe.reduce(function (a, r) { return a + r.prezzo * r.q; }, 0), c = e.modo === "consegna" ? 3 : 0;
      ordini.push({ numero: FV.nuovoNumero(), creato: ora + k, modo: e.modo, per: f.etichetta, perOra: f.ora, perValore: f.valore || "", nome: e.nome, telefono: "000 000 0000", note: k === 1 ? "Esempio di nota: citofono a destra" : "", zona: e.zona || "", indirizzo: e.indirizzo || "", righe: e.righe, consegna: c, totale: sub + c, stato: "ricevuto", auto: false, storia: [{ stato: "ricevuto", t: ora }], prova: true });
    });
    FV.scrivi("ordini", ordini); filtro = "arrivo";
    $$("#filtri [data-f]").forEach(function (x) { x.setAttribute("aria-selected", String(x.getAttribute("data-f") === "arrivo")); });
    disegna();
  });
  $("#svuota").addEventListener("click", function () {
    if (!confirm("Cancellare tutti gli ordini salvati in questo browser? Non si può annullare.")) return;
    FV.scrivi("ordini", []); FV.scrivi("ultimo", null); visti = []; disegna(); avvisa("Ordini della demo cancellati");
  });

  function orologio() { $("#orologio").textContent = new Date().toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" }) + " · " + new Date().toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" }); }
  window.addEventListener("storage", function (e) { if (e.key === "fv_ordini") disegna(); if (e.key === "fv_finiti") disegnaFiniti(); });
  orologio(); setInterval(orologio, 20000);
  disegnaFiniti(); disegna(); setInterval(disegna, 4000);
})();
