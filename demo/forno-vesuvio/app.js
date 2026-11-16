/* Forno Vesuvio - sito: menu, scheda prodotto, componi la tua pizza, carrello, ordine. */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var K = FV.COMPONI;
  var poco = window.matchMedia("(prefers-reduced-motion: reduce)");
  function esc(t) { return String(t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  // ---------- avviso breve ----------
  var tAvviso;
  function avvisa(t) { var a = $("#avviso"); a.textContent = t; a.classList.add("su"); clearTimeout(tAvviso); tAvviso = setTimeout(function () { a.classList.remove("su"); }, 2600); }

  // ---------- stato del locale ----------
  function aggiornaStato() {
    var s = FV.statoLocale();
    var p = $("#statoLocale"); p.classList.toggle("aperto", s.aperto);
    p.lastElementChild.textContent = s.testo;
  }

  // ---------- pizza del giorno ----------
  var GIRO = ["friarielli", "bufalina", "gialla", "calabrese", "ortolana", "diavola", "capricciosa"];
  var giorno = FV.trova(FV.MENU, GIRO[new Date().getDay()]);
  var SCONTO_GIORNO = 1;
  function prezzoMenu(p) { return p.id === giorno.id ? p.prezzo - SCONTO_GIORNO : p.prezzo; }
  function disegnaGiorno() {
    $("#tGiorno").textContent = giorno.nome;
    $("#giornoIngr").textContent = giorno.ingr;
    $("#giornoPrezzo").textContent = FV.euro(prezzoMenu(giorno));
    $("#giornoPrima").textContent = FV.euro(giorno.prezzo);
    $("#giornoQuando").textContent = "La pizza di " + new Date().toLocaleDateString("it-IT", { weekday: "long" });
    var box = $(".giorno-foto");
    if (giorno.foto) { box.innerHTML = '<img src="' + giorno.foto + '" alt="' + esc(giorno.nome) + ', vista dall\'alto" width="800" height="800" loading="lazy">'; }
    else { box.innerHTML = FVPizza.statica(Object.assign({ impasto: "classico", misura: "maxi", cottura: "classica" }, giorno.pz), giorno.nome + ", anteprima disegnata") + '<small class="disegno">Anteprima disegnata</small>'; }
  }
  $("#giornoAggiungi").addEventListener("click", function () { apriScheda(giorno.id); });

  // ---------- menu ----------
  var filtro = { cat: "tutte", testo: "", via: [], veg: false };
  function disegnaSchede() {
    var s = '<button role="tab" type="button" data-cat="tutte" aria-selected="true">Tutto</button>';
    FV.CATEGORIE.forEach(function (c) { s += '<button role="tab" type="button" data-cat="' + c.id + '" aria-selected="false">' + c.nome + '</button>'; });
    $("#schede").innerHTML = s;
    $("#schede").addEventListener("click", function (e) {
      var b = e.target.closest("[data-cat]"); if (!b) return;
      filtro.cat = b.getAttribute("data-cat");
      $$("#schede [data-cat]").forEach(function (x) { x.setAttribute("aria-selected", String(x === b)); });
      disegnaMenu();
    });
    var sp = "";
    ["glu", "lat", "uov", "pes", "fru", "sed", "sol"].forEach(function (k) { sp += '<label class="spunta"><input type="checkbox" value="' + k + '"> ' + FV.ALLERGENI[k] + '</label>'; });
    $("#spunteAllergeni").innerHTML = sp;
    $("#spunteAllergeni").addEventListener("change", function () {
      filtro.via = $$("#spunteAllergeni input:checked").map(function (i) { return i.value; }); disegnaMenu();
    });
    $("#soloVeg").addEventListener("change", function (e) { filtro.veg = e.target.checked; disegnaMenu(); });
    $("#cerca").addEventListener("input", function (e) { filtro.testo = e.target.value.trim().toLowerCase(); disegnaMenu(); });
  }
  function isPizza(p) { return p.cat === "classiche" || p.cat === "speciali"; }
  function vegetariano(p) { return p.veg || (p.pz && p.pz.top.every(function (t) { return ["salame", "prosciutto", "salsiccia", "nduja", "acciughe"].indexOf(t) < 0; }) && p.cat !== "fritti") || p.cat === "bevande"; }
  function disegnaMenu() {
    var out = "", tot = 0;
    FV.CATEGORIE.forEach(function (c) {
      if (filtro.cat !== "tutte" && filtro.cat !== c.id) return;
      var voci = FV.MENU.filter(function (p) {
        if (p.cat !== c.id) return false;
        if (filtro.testo && (p.nome + " " + p.ingr).toLowerCase().indexOf(filtro.testo) < 0) return false;
        if (filtro.veg && !vegetariano(p)) return false;
        return filtro.via.every(function (a) { return p.all.indexOf(a) < 0 || (a === "glu" && isPizza(p)); });
      });
      if (!voci.length) return;
      tot += voci.length;
      out += '<div class="cat rivela"><h3>' + c.nome + '</h3><ul>';
      voci.forEach(function (p) {
        var sg = filtro.via.indexOf("glu") >= 0 && isPizza(p);
        out += '<li><button type="button" class="voce" data-id="' + p.id + '">' +
          (p.foto ? '<img src="' + p.foto + '" alt="" width="800" height="800" loading="lazy">' : "") +
          '<span class="voce-t"><b>' + esc(p.nome) + (p.id === giorno.id ? ' <i class="bollo">Di oggi</i>' : "") + '</b><span>' + esc(p.ingr) + '</span>' +
          '<small>' + (sg ? '<i class="bollo verde">Con impasto senza glutine</i> ' : "") + (p.all.length ? "Allergeni: " + p.all.map(function (a) { return FV.ALLERGENI[a]; }).join(", ") : "Senza allergeni principali") + '</small></span>' +
          '<span class="voce-p">' + (p.id === giorno.id ? '<s>' + FV.euro(p.prezzo) + '</s>' : "") + FV.euro(prezzoMenu(p) + (sg ? 2.5 : 0)) + '<span class="piu" aria-hidden="true">+</span></span></button></li>';
      });
      out += "</ul></div>";
    });
    $("#listaMenu").innerHTML = out || '<p class="vuoto-msg">Nessun piatto con questi filtri. Prova a toglierne uno.</p>';
    var n = filtro.via.length + (filtro.veg ? 1 : 0);
    $("#filtriAttivi").textContent = n ? "(" + n + " attivi)" : "";
    osserva($$("#listaMenu .rivela"));
  }
  $("#listaMenu").addEventListener("click", function (e) { var b = e.target.closest(".voce"); if (b) apriScheda(b.getAttribute("data-id")); });

  // ---------- fogli (dialoghi) ----------
  var aperto = null, daDove = null;
  function apri(id) {
    chiudi(true);
    daDove = document.activeElement;
    aperto = $("#" + id); aperto.hidden = false; $("#velo").hidden = false;
    document.body.classList.add("bloccato");
    requestAnimationFrame(function () { aperto.classList.add("su"); $("#velo").classList.add("su"); });
    setTimeout(function () { var b = aperto && aperto.querySelector(".chiudi"); if (b) b.focus(); }, 30);
  }
  function chiudi(subito) {
    if (!aperto) return;
    var f = aperto; aperto = null;
    f.classList.remove("su"); $("#velo").classList.remove("su");
    document.body.classList.remove("bloccato");
    var fine = function () { f.hidden = true; if (!aperto) $("#velo").hidden = true; };
    if (subito === true || poco.matches) fine(); else setTimeout(fine, 260);
    if (daDove && subito !== true) try { daDove.focus(); } catch (e) { }
  }
  $("#velo").addEventListener("click", chiudi);
  $$("[data-chiudi]").forEach(function (b) { b.addEventListener("click", chiudi); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && aperto) chiudi();
    if (e.key === "Tab" && aperto) {
      var f = $$('button:not([hidden]),a[href],input,select,textarea,[tabindex="0"]', aperto).filter(function (x) { return x.offsetParent !== null && !x.disabled; });
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });

  // ---------- scheda prodotto ----------
  var sch = { p: null, q: 1 };
  function opzioniScheda(p) {
    if (!isPizza(p)) return [];
    var o = [{ id: "integrale", nome: "Impasto integrale", prezzo: 1 }, { id: "senzaglutine", nome: "Impasto senza glutine", prezzo: 2.5 }];
    if (p.pz.formaggio !== "nessuno") o.push({ id: "bufala", nome: "Bufala al posto del fior di latte", prezzo: 2 }, { id: "doppia", nome: "Doppia mozzarella", prezzo: 1.5 });
    o.push({ id: "bencotta", nome: "Ben cotta", prezzo: 0 }, { id: "tagliata", nome: "Tagliata a spicchi", prezzo: 0 });
    return o;
  }
  function apriScheda(id) {
    var p = FV.trova(FV.MENU, id); sch = { p: p, q: 1 };
    $("#schedaNome").textContent = p.nome;
    $("#schedaIngr").textContent = p.ingr;
    $("#schedaAll").innerHTML = p.all.length ? "<b>Allergeni</b> " + p.all.map(function (a) { return FV.ALLERGENI[a]; }).join(" · ") : "<b>Allergeni</b> nessuno dei 14 principali";
    $("#schedaMedia").innerHTML = p.foto ? '<img src="' + p.foto + '" alt="' + esc(p.nome) + '" width="800" height="800">' :
      p.pz ? FVPizza.statica(Object.assign({ impasto: "classico", misura: "maxi", cottura: "classica" }, p.pz), p.nome + ", anteprima disegnata") + '<small class="disegno">Anteprima disegnata, prima della cottura</small>' :
        '<div class="senza-foto"><span>' + esc(p.nome) + '</span></div>';
    $("#schedaMedia").classList.toggle("disegnata", !p.foto && !!p.pz);
    var o = opzioniScheda(p);
    $("#schedaOpz").innerHTML = o.length ? '<fieldset class="opz"><legend>Varianti</legend>' + o.map(function (x) {
      return '<label class="spunta riga-opz"><input type="checkbox" value="' + x.id + '"><span>' + x.nome + '</span><em>' + (x.prezzo ? "+ " + FV.euro(x.prezzo) : "gratis") + '</em></label>';
    }).join("") + '</fieldset>' : "";
    $("#schedaPersonalizza").hidden = !p.pz;
    totScheda(); apri("scheda");
  }
  function sceltaScheda() {
    var o = opzioniScheda(sch.p), sel = $$("#schedaOpz input:checked").map(function (i) { return i.value; });
    if (sel.indexOf("integrale") >= 0 && sel.indexOf("senzaglutine") >= 0) sel.splice(sel.indexOf("integrale"), 1);
    var extra = 0, nomi = [];
    o.forEach(function (x) { if (sel.indexOf(x.id) >= 0) { extra += x.prezzo; nomi.push(x.nome); } });
    return { extra: extra, nomi: nomi };
  }
  function totScheda() {
    var s = sceltaScheda();
    $("#qNum").textContent = sch.q;
    $("#schedaTot").textContent = FV.euro((prezzoMenu(sch.p) + s.extra) * sch.q);
  }
  $("#schedaOpz").addEventListener("change", function (e) {
    // impasti alternativi: uno solo
    if (e.target.checked && (e.target.value === "integrale" || e.target.value === "senzaglutine")) {
      var altro = $('#schedaOpz input[value="' + (e.target.value === "integrale" ? "senzaglutine" : "integrale") + '"]'); if (altro) altro.checked = false;
    }
    totScheda();
  });
  $("#qMeno").addEventListener("click", function () { if (sch.q > 1) { sch.q--; totScheda(); } });
  $("#qPiu").addEventListener("click", function () { if (sch.q < 20) { sch.q++; totScheda(); } });
  $("#schedaAggiungi").addEventListener("click", function () {
    var s = sceltaScheda();
    aggiungi({ tipo: "menu", id: sch.p.id, nome: sch.p.nome, prezzo: prezzoMenu(sch.p) + s.extra, q: sch.q, extra: s.nomi, pizza: isPizza(sch.p) });
    chiudi(); avvisa(sch.q + " × " + sch.p.nome + " nel carrello");
  });
  $("#schedaPersonalizza").addEventListener("click", function () {
    var p = sch.p; chiudi(true);
    carica(p.pz);
    location.hash = ""; $("#componi").scrollIntoView({ behavior: poco.matches ? "auto" : "smooth" });
  });

  // ---------- componi la tua pizza ----------
  var stato = { impasto: "classico", misura: "normale", salsa: "rossa", formaggio: "fiordilatte", top: ["basilico"], cottura: "classica" };
  var viva = FVPizza.crea($("#pizzaViva"));
  function finiti() { return FV.leggi("finiti", []); }

  function pillole(dove, lista, chiave, conPrezzo) {
    $(dove).innerHTML = lista.map(function (x) {
      var pr = conPrezzo === "assoluto" ? FV.euro(x.prezzo) : x.prezzo ? "+ " + FV.euro(x.prezzo) : "";
      return '<label class="pillola"><input type="radio" name="' + chiave + '" value="' + x.id + '"' + (stato[chiave] === x.id ? " checked" : "") + '><span><b>' + x.nome + '</b>' + (x.nota || pr ? '<small>' + [x.nota, pr].filter(Boolean).join(" · ") + '</small>' : "") + '</span></label>';
    }).join("");
  }
  function tessere() {
    var fin = finiti();
    $("#scIngredienti").innerHTML = K.ingredienti.map(function (x) {
      var no = fin.indexOf(x.id) >= 0;
      return '<label class="tessera' + (no ? " finito" : "") + '"><input type="checkbox" value="' + x.id + '"' + (stato.top.indexOf(x.id) >= 0 ? " checked" : "") + (no ? " disabled" : "") + '>' + FVPizza.icona(x.id) +
        '<span><b>' + x.nome + '</b><small>' + (no ? "Finito per oggi" : "+ " + FV.euro(x.prezzo)) + '</small></span><i class="spunta-t" aria-hidden="true"></i></label>';
    }).join("");
  }
  function disegnaScelte() {
    pillole("#scImpasto", K.impasti, "impasto");
    pillole("#scMisura", K.misure, "misura", "assoluto");
    pillole("#scSalsa", K.salse, "salsa");
    pillole("#scFormaggio", K.formaggi, "formaggio");
    pillole("#scCottura", K.cotture, "cottura");
    tessere();
  }

  var mostrato = 0, rafPrezzo;
  function animaPrezzo(fino) {
    cancelAnimationFrame(rafPrezzo);
    var da = mostrato, t0 = performance.now(), dur = poco.matches ? 0 : 380;
    function passo(t) {
      var k = dur ? Math.min(1, (t - t0) / dur) : 1, v = da + (fino - da) * (1 - Math.pow(1 - k, 3));
      mostrato = v; var s = FV.euro(v);
      $("#cartPrezzo").textContent = s; $("#totComponi").textContent = s; $("#totBtn").textContent = s;
      if (k < 1) rafPrezzo = requestAnimationFrame(passo); else mostrato = fino;
    }
    rafPrezzo = requestAnimationFrame(passo);
    $(".cartellino").classList.remove("batti"); void $(".cartellino").offsetWidth; $(".cartellino").classList.add("batti");
  }

  function riepilogo() {
    var m = FV.trova(K.misure, stato.misura), righe = [];
    righe.push([m.nome + " " + m.nota + ", impasto " + FV.trova(K.impasti, stato.impasto).nome.toLowerCase(), m.prezzo + FV.trova(K.impasti, stato.impasto).prezzo, null]);
    var sa = FV.trova(K.salse, stato.salsa); righe.push([sa.nome, sa.prezzo, null]);
    var fo = FV.trova(K.formaggi, stato.formaggio); righe.push([fo.nome, fo.prezzo, null]);
    stato.top.forEach(function (id) { var x = FV.trova(K.ingredienti, id); righe.push([x.nome, x.prezzo, id]); });
    righe.push(["Cottura: " + FV.trova(K.cotture, stato.cottura).nome.toLowerCase(), 0, null]);
    $("#riepilogo").innerHTML = righe.map(function (r) {
      return '<li><span>' + esc(r[0]) + '</span><span>' + (r[1] ? FV.euro(r[1]) : "incluso") + '</span>' + (r[2] ? '<button type="button" class="togli" data-togli="' + r[2] + '" aria-label="Togli ' + esc(r[0]) + '">×</button>' : "") + '</li>';
    }).join("");
    $("#quanti").textContent = stato.top.length + " di " + K.massimo;
    $("#cartMisura").textContent = m.nome + " · " + m.nota;
    $$("#scIngredienti input").forEach(function (i) {
      var pieno = stato.top.length >= K.massimo && !i.checked;
      i.closest(".tessera").classList.toggle("bloccata", pieno && !i.disabled);
    });
  }

  function applica(anima) {
    viva.aggiorna(stato, anima && !poco.matches ? true : anima);
    riepilogo();
    animaPrezzo(FV.prezzoPizza(stato));
    FV.scrivi("bozza", stato);
  }

  $("#formComponi").addEventListener("change", function (e) {
    var t = e.target;
    if (t.type === "radio") stato[t.name] = t.value;
    if (t.type === "checkbox") {
      var id = t.value;
      if (t.checked) {
        if (stato.top.length >= K.massimo) { t.checked = false; avvisa("Massimo " + K.massimo + " ingredienti: togline uno per aggiungerne un altro."); return; }
        stato.top.push(id);
      } else stato.top = stato.top.filter(function (x) { return x !== id; });
    }
    applica(true);
  });
  $("#riepilogo").addEventListener("click", function (e) {
    var b = e.target.closest("[data-togli]"); if (!b) return;
    var id = b.getAttribute("data-togli");
    stato.top = stato.top.filter(function (x) { return x !== id; });
    var i = $('#scIngredienti input[value="' + id + '"]'); if (i) i.checked = false;
    applica(true);
  });
  function carica(pz) {
    stato.salsa = pz.salsa; stato.formaggio = pz.formaggio;
    stato.top = pz.top.filter(function (t) { return finiti().indexOf(t) < 0; });
    disegnaScelte(); applica(true);
  }
  $(".parti").addEventListener("click", function (e) {
    var b = e.target.closest("[data-parti]"); if (!b) return;
    var k = b.getAttribute("data-parti");
    carica(k === "vuota" ? { salsa: "rossa", formaggio: "fiordilatte", top: [] } : FV.trova(FV.MENU, k).pz);
  });
  $("#ricomincia").addEventListener("click", function () {
    stato = { impasto: "classico", misura: "normale", salsa: "rossa", formaggio: "fiordilatte", top: [], cottura: "classica" };
    disegnaScelte(); applica(true);
  });
  $("#formComponi").addEventListener("submit", function (e) {
    e.preventDefault();
    var copia = JSON.parse(JSON.stringify(stato));
    aggiungi({ tipo: "composta", nome: "La tua pizza", composta: copia, prezzo: FV.prezzoPizza(copia), q: 1, pizza: true });
    var palco = $("#palco"); palco.classList.remove("parte"); void palco.offsetWidth; palco.classList.add("parte");
    avvisa("La tua pizza è nel carrello");
  });

  // ---------- carrello ----------
  var carrello = FV.leggi("carrello", []);
  function salvaCarrello() { FV.scrivi("carrello", carrello); contaCarrello(); }
  function contaCarrello() {
    var n = carrello.reduce(function (a, r) { return a + r.q; }, 0);
    ["#contaCarrello", "#contaCarrello2"].forEach(function (s) { $(s).textContent = n; });
    $("#apriCarrello").setAttribute("aria-label", "Apri il carrello, " + n + (n === 1 ? " prodotto" : " prodotti"));
    $$(".btn-carrello, .barra-tel button").forEach(function (b) { b.classList.remove("salta-su"); void b.offsetWidth; if (n) b.classList.add("salta-su"); });
  }
  function aggiungi(r) {
    var uguale = carrello.filter(function (x) { return x.tipo === "menu" && r.tipo === "menu" && x.id === r.id && JSON.stringify(x.extra) === JSON.stringify(r.extra); })[0];
    if (uguale) uguale.q += r.q; else { r.chiave = Date.now() + "-" + Math.random().toString(36).slice(2, 6); carrello.push(r); }
    salvaCarrello();
  }
  function subtotale() { return carrello.reduce(function (a, r) { return a + r.prezzo * r.q; }, 0); }
  function modo() { return $('input[name="modo"]:checked').value; }
  function disegnaCarrello() {
    $("#righe").innerHTML = carrello.map(function (r) {
      var img = r.tipo === "composta" ? FVPizza.statica(r.composta, "La tua pizza") : (FV.trova(FV.MENU, r.id) || {}).foto ? '<img src="' + FV.trova(FV.MENU, r.id).foto + '" alt="" width="800" height="800">' : '<span class="segnaposto" aria-hidden="true">' + esc(r.nome.charAt(0)) + '</span>';
      return '<li data-k="' + r.chiave + '"><span class="miniatura">' + img + '</span><span class="riga-t"><b>' + esc(r.nome) + '</b><small>' + esc(FV.descriviRiga(r)) + '</small><span class="riga-q"><button type="button" data-meno aria-label="Uno in meno">−</button><output>' + r.q + '</output><button type="button" data-piu aria-label="Uno in più">+</button></span></span><b class="riga-p">' + FV.euro(r.prezzo * r.q) + '</b></li>';
    }).join("");
    var vuoto = !carrello.length;
    $("#vuotoMsg").hidden = !vuoto; $("#checkout").hidden = vuoto;
    disegnaConti();
  }
  function costoConsegna() { return modo() === "consegna" ? FV.trova(FV.ZONE, $("#zona").value).costo : 0; }
  function disegnaConti() {
    var sub = subtotale(), c = costoConsegna();
    $("#cSub").textContent = FV.euro(sub);
    $("#rigaConsegna").hidden = modo() !== "consegna";
    $("#cCons").textContent = FV.euro(c);
    $("#cTot").textContent = FV.euro(sub + c);
  }
  function disegnaOrari() {
    var f = FV.fasce(modo()), sel = $("#orario"), prima = sel.value;
    sel.innerHTML = f.map(function (x) { return '<option value="' + x.valore + '">' + x.etichetta + '</option>'; }).join("");
    if (f.some(function (x) { return x.valore === prima; })) sel.value = prima;
  }
  $("#righe").addEventListener("click", function (e) {
    var li = e.target.closest("li"); if (!li) return;
    var r = carrello.filter(function (x) { return x.chiave === li.getAttribute("data-k"); })[0]; if (!r) return;
    if (e.target.closest("[data-piu]")) r.q++;
    else if (e.target.closest("[data-meno]")) { r.q--; if (r.q <= 0) carrello.splice(carrello.indexOf(r), 1); }
    else return;
    salvaCarrello(); disegnaCarrello();
  });
  $$('input[name="modo"]').forEach(function (i) {
    i.addEventListener("change", function () { $("#campiConsegna").hidden = modo() !== "consegna"; disegnaOrari(); disegnaConti(); });
  });
  $("#zona").innerHTML = FV.ZONE.map(function (z) { return '<option value="' + z.id + '">' + z.nome + " · " + FV.euro(z.costo) + '</option>'; }).join("");
  $("#zona").addEventListener("change", disegnaConti);
  $("#zone").innerHTML = FV.ZONE.map(function (z) { return '<li><span>' + z.nome + '</span><b>' + FV.euro(z.costo) + '</b></li>'; }).join("");
  function apriCarrello() { disegnaCarrello(); disegnaOrari(); var b = FV.leggi("cliente", null); if (b) { $("#nome").value = $("#nome").value || b.nome || ""; $("#telefono").value = $("#telefono").value || b.telefono || ""; } apri("carrello"); }
  $("#apriCarrello").addEventListener("click", apriCarrello);
  $("#apriCarrello2").addEventListener("click", apriCarrello);

  $("#formOrdine").addEventListener("submit", function (e) {
    e.preventDefault();
    var err = [], m = modo(), sub = subtotale();
    var nome = $("#nome").value.trim(), tel = $("#telefono").value.replace(/[^\d+]/g, "");
    $$("#formOrdine .campo").forEach(function (c) { c.classList.remove("sbagliato"); });
    function no(sel, t) { err.push(t); $(sel).closest(".campo").classList.add("sbagliato"); }
    if (!$("#orario").value) no("#orario", "scegli un orario");
    if (nome.length < 2) no("#nome", "scrivi il tuo nome");
    if (tel.replace("+", "").length < 8) no("#telefono", "controlla il telefono");
    if (m === "consegna") {
      if ($("#indirizzo").value.trim().length < 5) no("#indirizzo", "scrivi l'indirizzo");
      if (sub < FV.MINIMO_CONSEGNA) err.push("per la consegna servono almeno " + FV.euro(FV.MINIMO_CONSEGNA) + " di prodotti (mancano " + FV.euro(FV.MINIMO_CONSEGNA - sub) + ")");
    }
    if (err.length) { $("#errOrdine").textContent = "Manca qualcosa: " + err.join(", ") + "."; var p = $("#formOrdine .sbagliato input, #formOrdine .sbagliato select"); if (p) p.focus(); return; }
    $("#errOrdine").textContent = "";
    var f = FV.fasce(m).filter(function (x) { return x.valore === $("#orario").value; })[0];
    var o = {
      numero: FV.nuovoNumero(), creato: Date.now(), modo: m, per: f ? f.etichetta : $("#orario").value, perOra: f ? f.ora : "", perValore: f ? f.valore : "",
      nome: nome, telefono: $("#telefono").value.trim(), note: $("#note").value.trim(),
      zona: m === "consegna" ? FV.trova(FV.ZONE, $("#zona").value).nome : "", indirizzo: m === "consegna" ? ($("#indirizzo").value.trim() + ($("#citofono").value.trim() ? " · " + $("#citofono").value.trim() : "")) : "",
      righe: carrello, consegna: costoConsegna(), totale: sub + costoConsegna(),
      stato: "ricevuto", auto: true, storia: [{ stato: "ricevuto", t: Date.now() }]
    };
    var ordini = FV.leggi("ordini", []); ordini.push(o); FV.scrivi("ordini", ordini);
    FV.scrivi("ultimo", o.numero); FV.scrivi("cliente", { nome: nome, telefono: o.telefono });
    carrello = []; salvaCarrello();
    $("#note").value = "";
    mostraOrdine(true);
  });

  // ---------- stato dell'ordine ----------
  function ordineMio() { var n = FV.leggi("ultimo", null); return n ? FV.leggi("ordini", []).filter(function (o) { return o.numero === n; })[0] : null; }
  function disegnaOrdine(appena) {
    var o = ordineMio(); if (!o) return;
    var passi = ["ricevuto", "preparazione", "forno", "uscita", "chiuso"], idx = passi.indexOf(o.stato);
    var spieg = {
      ricevuto: "Il banco ha il tuo ordine. Tra poco lo prepariamo.",
      preparazione: "Stiamo stendendo l'impasto e mettendo gli ingredienti.",
      forno: "È nel forno a legna: circa 90 secondi.",
      uscita: o.modo === "consegna" ? "Il fattorino è partito verso " + (o.indirizzo.split(" · ")[0] || "casa tua") + "." : "È pronta al banco. Di' il numero " + o.numero + ".",
      chiuso: o.modo === "consegna" ? "Consegnato. Buon appetito." : "Ritirato. Buon appetito.",
      annullato: "Ordine annullato dal locale. Nella realtà ti avremmo chiamato."
    };
    $("#ordineIn").innerHTML =
      (appena ? '<p class="ok-ordine">Ordine confermato</p>' : "") +
      '<h2 id="ordineTitolo">Ordine <span class="num">' + o.numero + '</span></h2>' +
      '<p class="ordine-quando">' + (o.modo === "consegna" ? "Consegna" : "Ritiro al banco") + " · " + esc(o.per) + '</p>' +
      '<p class="ordine-ora" aria-live="polite"><b>' + FV.nomeStato(o.stato, o.modo) + '</b><span>' + spieg[o.stato] + '</span></p>' +
      (o.stato === "annullato" ? "" : '<ol class="tappe">' + passi.map(function (s, i) {
        return '<li class="' + (i < idx ? "fatto" : i === idx ? "ora" : "") + '"><i aria-hidden="true"></i><span>' + FV.nomeStato(s, o.modo) + '</span>' + (o.storia.filter(function (h) { return h.stato === s; })[0] ? '<small>' + new Date(o.storia.filter(function (h) { return h.stato === s; })[0].t).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" }) + '</small>' : "") + '</li>';
      }).join("") + '</ol>') +
      '<ul class="ordine-righe">' + o.righe.map(function (r) { return '<li><span>' + r.q + " × " + esc(r.nome) + (FV.descriviRiga(r) ? '<small>' + esc(FV.descriviRiga(r)) + '</small>' : "") + '</span><b>' + FV.euro(r.prezzo * r.q) + '</b></li>'; }).join("") +
      (o.consegna ? '<li><span>Consegna</span><b>' + FV.euro(o.consegna) + '</b></li>' : "") + '<li class="tot"><span>Totale da pagare</span><b>' + FV.euro(o.totale) + '</b></li></ul>' +
      '<p class="nota">In questa demo lo stato avanza da solo ogni mezzo minuto circa. Dal <a href="admin.html" target="_blank" rel="noopener">pannello del titolare<span class="sr"> (si apre in una nuova scheda)</span></a> puoi cambiarlo tu e vederlo aggiornarsi qui.</p>';
    $("#apriOrdine").hidden = o.stato === "chiuso" || o.stato === "annullato";
  }
  function mostraOrdine(appena) { disegnaOrdine(appena); apri("ordine"); }
  $("#apriOrdine").addEventListener("click", function () { mostraOrdine(false); });

  var ultimoStato = "";
  function giro() {
    FV.avanzaAuto();
    var o = ordineMio();
    if (!o) return;
    var firma = o.numero + o.stato;
    if (firma !== ultimoStato) {
      if (ultimoStato && ultimoStato.indexOf(o.numero) === 0) avvisa("Ordine " + o.numero + ": " + FV.nomeStato(o.stato, o.modo).toLowerCase());
      ultimoStato = firma;
      $("#apriOrdine").hidden = o.stato === "chiuso" || o.stato === "annullato";
      if (aperto && aperto.id === "ordine") disegnaOrdine(false);
    }
  }
  window.addEventListener("storage", function (e) {
    if (e.key === "fv_ordini") giro();
    if (e.key === "fv_finiti") { tessere(); stato.top = stato.top.filter(function (t) { return finiti().indexOf(t) < 0; }); applica(false); }
  });

  // ---------- comparse allo scorrimento ----------
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (v) {
    v.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } });
  }, { rootMargin: "0px 0px -8% 0px" }) : null;
  function osserva(el) { el.forEach(function (e) { if (io) io.observe(e); else e.classList.add("in"); }); }

  // nel banco di Componi la barra del telefono lascia il posto al totale
  if ("IntersectionObserver" in window) new IntersectionObserver(function (v) {
    document.body.classList.toggle("in-componi", v[0].isIntersecting);
  }, { rootMargin: "-40% 0px -40% 0px" }).observe($("#formComponi"));

  // avanzamento dei passi in cucina
  function passiScorrimento() {
    var ol = $("#passi"), r = ol.getBoundingClientRect(), h = innerHeight;
    var k = Math.max(0, Math.min(1, (h * .7 - r.top) / r.height));
    ol.style.setProperty("--avanza", k.toFixed(3));
    $$("#passi li").forEach(function (li) { var q = li.getBoundingClientRect(); li.classList.toggle("acceso", q.top < h * .7); });
  }
  var tick = false;
  addEventListener("scroll", function () { if (!tick) { tick = true; requestAnimationFrame(function () { passiScorrimento(); tick = false; }); } }, { passive: true });

  // effetto profondità sulla pizza (solo con il mouse)
  var palco = $("#palco");
  palco.addEventListener("pointermove", function (e) {
    if (e.pointerType !== "mouse" || poco.matches) return;
    var r = palco.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    palco.style.setProperty("--rx", (-y * 8).toFixed(2) + "deg"); palco.style.setProperty("--ry", (x * 8).toFixed(2) + "deg");
  });
  palco.addEventListener("pointerleave", function () { palco.style.setProperty("--rx", "0deg"); palco.style.setProperty("--ry", "0deg"); });

  // ---------- avvio ----------
  var bozza = FV.leggi("bozza", null);
  if (bozza && bozza.misura && FV.trova(K.misure, bozza.misura)) stato = bozza;
  stato.top = stato.top.filter(function (t) { return finiti().indexOf(t) < 0 && FV.trova(K.ingredienti, t); });
  aggiornaStato(); setInterval(aggiornaStato, 60000);
  disegnaGiorno(); disegnaSchede(); disegnaMenu(); disegnaScelte();
  applica(false);
  contaCarrello(); giro(); setInterval(giro, 3000);
  osserva($$(".rivela")); passiScorrimento();
})();
