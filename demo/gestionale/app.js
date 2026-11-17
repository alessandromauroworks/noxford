/* Motore dei gestionali dimostrativi - Noxford Agency (v2, 17/11/2026), costruito sul Kit Noxford.
   URL: ?nicchia=<settore>&stile=<a|b|c|d>&tema=<chiaro|scuro>&vetro=<si|no>&foto=1  ·  #<vista>
   foto=1 nasconde la striscia della demo (solo per gli screenshot del portfolio).
   Dati inventati (nicchie.js). Niente viene inviato a server: i contatti del CRM restano nel browser. */
(function () {
  "use strict";
  var d = document, N = window.NICCHIE || {}, NX = window.NX;
  var esc = NX.esc;
  var oggi = new Date();
  if (oggi.getDay() === 6) oggi = new Date(oggi.getTime() + 2 * 864e5); /* nel fine settimana si mostra il lunedì */
  if (oggi.getDay() === 0) oggi = new Date(oggi.getTime() + 864e5);
  var GIORNI = ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"];
  var MESI = ["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"];
  var MESIL = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];
  var ORA = oggi.getHours() + oggi.getMinutes() / 60;

  var ICONE = {
    home: '<path d="M3.5 10.5L12 3.5l8.5 7"/><path d="M5.5 9v11h13V9"/><path d="M10 20v-6h4v6"/>',
    cal: '<rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    people: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.6-3.6 3.2-5.5 6.5-5.5s5.9 1.9 6.5 5.5M16 4.8a3.5 3.5 0 010 6.4M18 14.8c1.9.7 3 2.4 3.5 5.2"/>',
    doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
    folder: '<path d="M3 6.5A1.5 1.5 0 014.5 5H9l2 2.5h8.5A1.5 1.5 0 0121 9v9.5a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 18.5z"/>',
    box: '<path d="M3.5 7.5L12 3l8.5 4.5v9L12 21l-8.5-4.5z"/><path d="M3.5 7.5L12 12l8.5-4.5M12 12v9"/>',
    grid: '<rect x="3" y="3" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="2"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2"/>',
    card: '<rect x="3" y="6" width="18" height="13" rx="2.5"/><path d="M3 10h18M7 15h4"/>',
    check: '<rect x="3.5" y="3.5" width="17" height="17" rx="4"/><path d="M8 12.5l2.7 2.7L16 9.8"/>',
    euro: '<path d="M17.5 6.5A6.5 6.5 0 006.6 9.5M17.5 17.5a6.5 6.5 0 01-10.9-3M4 10h9M4 14h8"/>',
    spark: '<path d="M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9z"/><path d="M18.5 15.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>',
    receipt: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6M9 16h3"/>',
    scale: '<path d="M12 4v16M7 20h10M5 7h14"/><path d="M5 7l-3 6a3 3 0 006 0zM19 7l-3 6a3 3 0 006 0z"/>',
    chair: '<path d="M7 4h6a2 2 0 012 2v6H7z"/><path d="M5 12h14l-1 4H6zM8 16v4M16 16v4"/>',
    helmet: '<path d="M4 16a8 8 0 0116 0z"/><path d="M3 16h18v2.5H3zM10 8.3V5h4v3.3"/>',
    flame: '<path d="M12 21a6 6 0 006-6c0-4-3-6-4-10-2 2-3 4-3 6-1-1-1.5-2-1.5-3C7 10 6 12.5 6 15a6 6 0 006 6z"/>',
    table: '<rect x="3" y="8" width="18" height="3" rx="1"/><path d="M6 11v9M18 11v9M9 5h6"/>',
    bed: '<path d="M3 18V6M3 13h18v5M21 13a3 3 0 00-3-3h-7v3"/><circle cx="7" cy="10.5" r="1.8"/>',
    piu: '<circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>',
    giu: '<path d="M12 4v11M7 10.5l5 5 5-5M5 20h14"/>',
    su: '<path d="M12 16V5M7 9.5l5-5 5 5M5 20h14"/>',
    copia: '<rect x="8" y="8" width="12" height="12" rx="2.5"/><path d="M16 8V5.5A1.5 1.5 0 0014.5 4h-9A1.5 1.5 0 004 5.5v9A1.5 1.5 0 005.5 16H8"/>'
  };
  function svg(k) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + (ICONE[k] || ICONE.doc) + "</svg>"; }
  function dataBreve(n) { var x = new Date(oggi); x.setDate(x.getDate() + n); return x.getDate() + " " + MESI[x.getMonth()]; }
  function tx(s) { return esc(s).replace(/@d([+-]\d+)/g, function (_, n) { return dataBreve(+n); }); }
  function txt(s) { return String(s).replace(/@d([+-]\d+)/g, function (_, n) { return dataBreve(+n); }); }
  var RE_P = /^(ok|wait|acc|no|info|)\|(.*)$/;
  function pill(s) { var m = RE_P.exec(String(s)); return m ? '<span class="nx-pill ' + m[1] + '">' + tx(m[2]) + "</span>" : null; }
  function puro(s) { var m = RE_P.exec(String(s)); return txt(m ? m[2] : s); }
  function euro(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " €"; }

  /* ---------- registro dei blocchi della vista corrente ---------- */
  var BL = [];

  function testa(b, k, extra) {
    return '<div class="g-bh"><h2>' + (b.t === "ia" ? '<span class="g-ia-l">' + svg("spark") + "IA</span>" : "") + tx(b.h) + "</h2>" + (extra || "") + "</div>";
  }

  var R = {
    kpi: function (b) {
      return '<div class="g-kpi n' + b.v.length + '">' + b.v.map(function (k) {
        return '<div class="g-k"><span>' + tx(k[0]) + '</span><b class="nx-num">' + tx(k[1]) + "</b>" + (k[2] ? "<small>" + (k[3] === "su" ? '<i class="g-su" aria-hidden="true">▲</i>' : "") + tx(k[2]) + "</small>" : "") + "</div>";
      }).join("") + "</div>";
    },
    lista: function (b) {
      return testa(b) + '<ol class="g-lista">' + b.r.map(function (r) {
        var cl = /^acc\|/.test(r[3]) ? "ora" : /^ok\|/.test(r[3]) ? "fatto" : /^no\|/.test(r[3]) ? "urg" : "";
        return '<li class="' + cl + '" data-q="' + esc((r[1] + " " + r[2]).toLowerCase()) + '"><time class="nx-num">' + tx(r[0]) + '</time><i class="g-dot" aria-hidden="true"></i><div class="g-l-tx"><b>' + tx(r[1]) + "</b><small>" + tx(r[2]) + "</small></div>" + (pill(r[3]) || "") + "</li>";
      }).join("") + "</ol>";
    },
    tab: function (b, k) {
      var ultima = b.c.length - 1, f = b._f || "tutti";
      var labels = [];
      if (b.filtro) b.r.forEach(function (r) { var l = puro(r[ultima]); if (labels.indexOf(l) < 0) labels.push(l); });
      var rows = b.r.map(function (r, i) { return { r: r, i: i }; }).filter(function (o) { return f === "tutti" || puro(o.r[ultima]) === f; });
      var az = b.azione, extra = "";
      if (b.imp) extra += '<button type="button" class="nx-btn g-mini" data-az="imp" aria-label="Importa ' + esc(b.imp.cosa) + ' da CSV o Fogli Google">' + svg("giu") + "<span>Importa</span></button>";
      if (b.esporta) extra += '<button type="button" class="nx-btn g-mini" data-az="esp" aria-label="Esporta in CSV: ' + esc(b.h) + '">' + svg("su") + "<span>Esporta</span></button>";
      var h = testa(b, k, extra ? '<div class="g-bh-a">' + extra + "</div>" : "");
      if (b.filtro) h += '<div class="nx-chips g-filtri" role="group" aria-label="Filtra">' + ["tutti"].concat(labels).map(function (l) {
        var n = l === "tutti" ? b.r.length : b.r.filter(function (r) { return puro(r[ultima]) === l; }).length;
        return '<button type="button" class="nx-chip" data-az="filtro" data-f="' + esc(l) + '" aria-pressed="' + (f === l) + '">' + (l === "tutti" ? "Tutti" : esc(l)) + "<em>" + n + "</em></button>";
      }).join("") + "</div>";
      if (!rows.length) return h + NX.stato.vuoto("Niente qui", "Nessuna riga con questo stato.", ["Mostra tutto", "tutti"]);
      h += '<div class="g-tw nx-solo-largo"><table><thead><tr>' + b.c.map(function (c, i) { return '<th' + (i === ultima ? ' class="g-st"' : "") + ">" + tx(c) + "</th>"; }).join("") + (az ? '<th><span class="nx-sr">Azione</span></th>' : "") + "</tr></thead><tbody>" +
        rows.map(function (o) {
          var r = o.r, fatto = az && r[ultima] === az.a;
          return '<tr data-q="' + esc(r.map(puro).join(" ").toLowerCase()) + '">' + r.map(function (c, i) { return "<td" + (i === 0 ? ' class="pr"' : "") + ">" + (pill(c) || tx(c)) + "</td>"; }).join("") +
            (az ? '<td class="g-az">' + (fatto ? "" : '<button type="button" class="nx-btn t g-mini" data-az="riga" data-i="' + o.i + '">' + esc(az.l) + "</button>") + "</td>" : "") + "</tr>";
        }).join("") + "</tbody></table></div>";
      h += '<ul class="nx-lista nx-solo-stretto g-tl">' + rows.map(function (o) {
        var r = o.r, sotto = r.slice(1, ultima).map(puro).filter(function (x) { return x && x !== "—"; }).join(" · ");
        return '<li data-q="' + esc(r.map(puro).join(" ").toLowerCase()) + '"><button type="button" class="nx-cella" data-az="apri" data-i="' + o.i + '"><span class="nx-c-tx"><b>' + tx(r[0]) + "</b><small>" + esc(sotto) + '</small></span><span class="nx-c-dx">' + (pill(r[ultima]) || "") + '<i class="nx-chev"></i></span></button></li>';
      }).join("") + "</ul>";
      return h;
    },
    celle: function (b) {
      return testa(b) + '<ul class="g-celle">' + b.r.map(function (r, i) {
        var m = RE_P.exec(r[1]);
        return '<li data-q="' + esc((r[0] + " " + r[2]).toLowerCase()) + '"><button type="button" class="g-cel st-' + (m ? m[1] || "x" : "x") + '" data-az="cella" data-i="' + i + '" data-nx-premi><b>' + tx(r[0]) + "</b>" + (pill(r[1]) || "") + "<small>" + (tx(r[2]) || "&nbsp;") + "</small></button></li>";
      }).join("") + "</ul>";
    },
    agenda: function (b) {
      var ore = b.a - b.da, H = 54, h = "";
      for (var o = b.da; o <= b.a; o++) h += '<span class="g-ag-ora" style="top:' + (o - b.da) * H + 'px">' + o + ":00</span>";
      var adesso = ORA >= b.da && ORA <= b.a ? '<i class="g-ag-ora-ora" style="top:' + (ORA - b.da) * H + 'px" aria-hidden="true"></i>' : "";
      return testa(b) + '<div class="g-ag" style="--ris:' + b.ris.length + '"><div class="g-ag-in"><div class="g-ag-t"><span></span>' + b.ris.map(function (r) { return "<b>" + esc(r) + "</b>"; }).join("") + "</div>" +
        '<div class="g-ag-c" style="height:' + ore * H + 'px"><div class="g-ag-assi">' + h + "</div>" + b.ris.map(function (_, ri) {
          return '<div class="g-ag-col">' + b.ev.filter(function (e) { return e[0] === ri; }).map(function (e) {
            var hh = function (x) { var hr = Math.floor(x), mi = Math.round((x - hr) * 60); return hr + ":" + (mi < 10 ? "0" : "") + mi; };
            return '<button type="button" class="g-ag-ev ' + (e[5] || "x") + (e[2] <= .75 ? " corto" : "") + '" data-az="ev" data-q="' + esc((e[3] + " " + e[4]).toLowerCase()) + '" data-t="' + esc(e[3]) + '" data-s="' + esc(e[4] + " · " + hh(e[1]) + "–" + hh(e[1] + e[2]) + " · " + b.ris[ri]) + '" style="top:' + (e[1] - b.da) * H + "px;height:" + (e[2] * H - 3) + 'px"><b>' + esc(e[3]) + "</b><small>" + hh(e[1]) + " · " + esc(e[4]) + "</small></button>";
          }).join("") + "</div>";
        }).join("") + adesso + "</div></div></div>";
    },
    scad: function (b) {
      return testa(b) + '<ul class="g-scad">' + b.r.map(function (r) {
        var n = r[0], x = new Date(oggi); x.setDate(x.getDate() + n);
        var q = n < 0 ? "scaduta da " + (-n) + (n === -1 ? " giorno" : " giorni") : n === 0 ? "oggi" : n === 1 ? "domani" : "tra " + n + " giorni";
        var cl = n <= 0 ? "urg" : n <= 3 ? "vicina" : "";
        return '<li class="' + cl + '" data-q="' + esc((r[1] + " " + r[2]).toLowerCase()) + '"><span class="g-sc-d" aria-hidden="true"><b class="nx-num">' + x.getDate() + "</b>" + MESI[x.getMonth()] + '</span><div class="g-l-tx"><b>' + tx(r[1]) + "</b><small>" + esc(q) + " · " + tx(r[2]) + "</small></div>" + (pill(r[3]) || "") + "</li>";
      }).join("") + "</ul>";
    },
    barre: function (b) {
      var max = Math.max.apply(null, b.v.map(function (v) { return v[1]; })) || 1;
      return testa(b) + '<div class="g-barre" role="img" aria-label="' + esc(b.h + ": " + b.v.map(function (v) { return v[0] + " " + v[1] + (b.u === "%" ? "%" : b.u === "k" ? " mila euro" : ""); }).join(", ")) + '">' + b.v.map(function (v, i) {
        var val = v[1] ? (String(v[1]).replace(".", ",") + (b.u === "k" ? "k" : b.u === "%" ? "%" : "")) : "—";
        return '<div class="g-bc' + (i === b.v.length - 1 ? " ult" : "") + '"><em class="nx-num">' + val + '</em><i style="--h:' + Math.max(2, Math.round(v[1] / max * 100)) + '%"></i><span>' + tx(v[0]) + "</span></div>";
      }).join("") + "</div>";
    },
    avanz: function (b) {
      return testa(b) + '<ul class="g-avanz">' + b.r.map(function (r) {
        return '<li data-q="' + esc(r[0].toLowerCase()) + '"><div class="g-ar"><b>' + tx(r[0]) + '</b><em class="nx-num">' + r[1] + '%</em></div><span class="g-tr" role="progressbar" aria-valuenow="' + r[1] + '" aria-valuemin="0" aria-valuemax="100" aria-label="' + esc(r[0]) + '"><i style="--w:' + r[1] + '%"></i></span>' + (r[2] ? "<small>" + tx(r[2]) + "</small>" : "") + "</li>";
      }).join("") + "</ul>";
    },
    ia: function (b) {
      return testa(b) + '<p class="g-ia-t">' + tx(b.p) + '</p><div class="g-ia-a">' + (b.a || []).map(function (a) { return '<button type="button" class="nx-btn g-ia-b" data-az="ia">' + tx(a) + "</button>"; }).join("") + '</div><p class="g-ia-n">Esempio di funzione IA: in uso reale il testo va sempre controllato da una persona.</p>';
    },
    check: function (b) {
      return testa(b, 0, '<span class="g-conta"></span>') + '<ul class="g-check">' + b.r.map(function (r) {
        return '<li data-q="' + esc(r[0].toLowerCase()) + '"><label><input type="checkbox"' + (/^fatto/.test(r[1]) ? " checked" : "") + '><i aria-hidden="true"></i><span><b>' + tx(r[0]) + "</b>" + (r[1] ? "<small>" + tx(r[1]) + "</small>" : "") + "</span></label></li>";
      }).join("") + "</ul>";
    },
    pd: function (b) {
      return testa(b) + '<ul class="g-pd">' + b.r.map(function (r) {
        var max = Math.max(r[1], r[2], 1), meglio = (r[2] < r[1]) === !b.su;
        return '<li><div class="g-ar"><b>' + tx(r[0]) + '</b><em class="nx-num ' + (meglio ? "bene" : "") + '">' + r[1] + " → " + r[2] + '</em></div><span class="g-pdb pr"><i style="--w:' + Math.round(r[1] / max * 100) + '%"></i><small>prima</small></span><span class="g-pdb do"><i style="--w:' + Math.round(r[2] / max * 100) + '%"></i><small>dopo</small></span><small class="g-pdn">' + tx(r[3]) + "</small></li>";
      }).join("") + '</ul><p class="g-ia-n">Valori di esempio, per mostrare come si leggono gli indicatori.</p>';
    },
    crm: function () { return '<div class="g-crm"></div>'; }
  };
  function blocco(b, k) {
    if (b.t === "kpi") return '<section class="g-blk w-f g-kpis" data-k="' + k + '">' + R.kpi(b) + "</section>";
    return '<section class="g-blk w-' + (b.w || "m") + " t-" + b.t + '" data-k="' + k + '">' + R[b.t](b, k) + "</section>";
  }
  function ridisegna(k) {
    var s = d.querySelector('#vista [data-k="' + k + '"]'); if (!s) return;
    var n = NX.el(blocco(BL[k], k)); s.replaceWith(n); contaCheck();
  }

  /* ---------- vista Incassi generata dai dati della nicchia ---------- */
  var STI = { ok: "ok|Incassato", wait: "wait|Da incassare", no: "no|Scaduto" };
  function vistaIncassi(n) {
    var I = n.incassi;
    var inc = I.base, da = 0, sc = 0, aperti = 0;
    I.voci.forEach(function (v) { if (v[4] === "ok") inc += v[2]; else { da += v[2]; aperti++; if (v[4] === "no") sc += v[2]; } });
    var tab = I._tab || (I._tab = { t: "tab", w: "f", h: "Pagamenti", filtro: true, esporta: "incassi-" + MESIL[oggi.getMonth()] + ".csv", c: ["Cliente", "Voce", "Importo", "Scadenza", "Stato"], azione: { l: "Segna incassato", a: STI.ok }, incassi: true });
    tab.r = I.voci.map(function (v) { return [v[0], v[1], euro(v[2]), v[3] === 0 ? "oggi" : "@d" + (v[3] > 0 ? "+" : "") + v[3], STI[v[4]]]; });
    return [
      { t: "kpi", v: [["Incassato a " + MESIL[oggi.getMonth()], euro(inc), "fino a oggi"], ["Da incassare", euro(da), aperti + (aperti === 1 ? " pagamento aperto" : " pagamenti aperti")], ["Scaduto", euro(sc), sc ? "da sollecitare" : "niente in ritardo"]] },
      tab,
      { t: "ia", w: "s", h: I.ia.h, p: I.ia.p, a: I.ia.a, bozza: I.ia.bozza },
      { t: "barre", w: "s", h: "Incassi, ultimi 6 mesi", u: "k", v: I.mesi },
      { t: "pd", w: "s", h: "Prima e dopo il gestionale", r: I.pd }
    ];
  }

  /* ---------- stato ---------- */
  var q = new URLSearchParams(location.search);
  var nicchia = N[q.get("nicchia")] ? q.get("nicchia") : Object.keys(N)[0];
  var stile = /^[abcd]$/.test(q.get("stile") || "") ? q.get("stile") : "a";
  var foto = q.get("foto") === "1";
  var viste = [], vistaId = null, crmApi = null, segStile = null;

  /* preferenze: i parametri dell'indirizzo valgono solo per questa visita */
  NX.pref.init();
  if (q.get("tema")) NX.pref.tema(q.get("tema"), { salva: false });
  if (q.get("vetro")) NX.pref.vetro(q.get("vetro") !== "no", { salva: false });

  function scriviUrl() {
    var p = new URLSearchParams(location.search); p.set("nicchia", nicchia); p.set("stile", stile);
    try { history.replaceState(null, "", location.pathname + "?" + p.toString() + location.hash); } catch (e) {}
  }
  function preparaNicchia() {
    var n = N[nicchia];
    viste = n.viste.concat([{ id: "incassi", nome: "Incassi", ic: "euro" }]);
    d.documentElement.style.setProperty("--tinta", n.tinta);
    ["nome"].forEach(function () { d.getElementById("nome").textContent = n.nome; });
    d.getElementById("settore").textContent = n.settore;
    d.getElementById("sigla").textContent = n.sigla; d.getElementById("sigla2").textContent = n.sigla;
    d.getElementById("io").textContent = n.utente || "MR";
    d.getElementById("nav").innerHTML = viste.map(function (v) { return '<a href="#' + v.id + '" data-v="' + v.id + '">' + svg(v.ic) + "<span>" + esc(v.nome) + "</span></a>"; }).join("");
    var tab = viste.length > 5 ? viste.slice(0, 4) : viste;
    d.getElementById("g-tab").innerHTML = tab.map(function (v) { return '<a href="#' + v.id + '" data-v="' + v.id + '">' + svg(v.ic) + "<span>" + esc(v.breve || v.nome) + "</span></a>"; }).join("") +
      (viste.length > 5 ? '<button type="button" id="g-altro">' + svg("piu") + "<span>Altro</span></button>" : "");
    d.getElementById("sel-n").value = nicchia;
    crmApi = null;
  }
  function trovaVista(id) { var v = null; viste.forEach(function (x) { if (x.id === id) v = x; }); return v || viste[0]; }
  function mostra(anim) {
    var v = trovaVista((location.hash || "").slice(1)), n = N[nicchia];
    var prima = viste.indexOf(trovaVista(vistaId)), dopo = viste.indexOf(v);
    vistaId = v.id;
    BL = v.id === "incassi" ? vistaIncassi(n) : v.crm ? [{ t: "crm", w: "f" }] : v.b;
    var html = '<div class="g-griglia">' + BL.map(blocco).join("") + "</div>";
    if (anim && !foto) NX.vista(d.getElementById("vista"), html, dopo > prima ? "dx" : "sx"); else d.getElementById("vista").innerHTML = html;
    if (v.crm) {
      var c = n.crm;
      crmApi = NX.crm(d.querySelector("#vista .g-crm"), {
        nome: c.nome, sing: c.sing, plur: c.plur, nomeCol: c.nomeCol, fasi: c.fasi, toniFasi: c.toni, campi: c.campi, dati: c.dati, oggi: oggi,
        chiave: "nx-crm-" + nicchia, nomeFile: c.plur + "-" + nicchia + ".csv", esempio: NX.csv.scrivi(c.esempio)
      });
    }
    d.querySelectorAll("#nav a, #g-tab a").forEach(function (a) { if (a.getAttribute("data-v") === v.id) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
    var altro = d.getElementById("g-altro");
    if (altro) { var fuori = viste.indexOf(v) >= 4; altro.setAttribute("aria-selected", fuori ? "true" : "false"); }
    d.getElementById("titolo").textContent = v.nome; d.getElementById("tit-pic").textContent = v.nome;
    d.title = v.nome + " · " + n.settore + " · Demo gestionale | Noxford Agency";
    d.body.classList.toggle("g-v-crm", !!v.crm);
    d.getElementById("cerca").value = "";
    contaCheck();
  }
  function applicaStile() {
    d.body.setAttribute("data-stile", stile);
    if (segStile) segStile.scegli(stile);
  }
  function contaCheck() {
    d.querySelectorAll("#vista .t-check").forEach(function (s) {
      var n = s.querySelectorAll("input:not(:checked)").length, c = s.querySelector(".g-conta");
      if (c) c.textContent = n ? n + " da fare" : "tutto fatto";
    });
  }

  /* ---------- intestazione e controlli della demo ---------- */
  d.getElementById("g-oggi").textContent = GIORNI[oggi.getDay()].replace(/^./, function (c) { return c.toUpperCase(); }) + " " + oggi.getDate() + " " + MESIL[oggi.getMonth()] + " " + oggi.getFullYear();
  var sel = d.getElementById("sel-n");
  sel.innerHTML = Object.keys(N).map(function (k) { return '<option value="' + k + '">' + esc(N[k].settore) + "</option>"; }).join("");
  function cambiaNicchia(k) {
    nicchia = k; preparaNicchia();
    try { history.replaceState(null, "", location.pathname + location.search); } catch (e) {}
    scriviUrl(); mostra(true); window.scrollTo(0, 0);
  }
  sel.addEventListener("change", function () { cambiaNicchia(sel.value); });
  segStile = NX.seg(d.getElementById("seg-stile"), function (v) { stile = v; applicaStile(); scriviUrl(); });
  NX.pref.collega(d.getElementById("tg-tema"), "tema");
  NX.pref.collega(d.getElementById("tg-vetro"), "vetro");

  /* sul telefono le opzioni della demo stanno in un foglio */
  d.getElementById("g-demo-btn").addEventListener("click", function () {
    var f = NX.foglio.apri({
      titolo: "Opzioni della demo",
      html: '<label class="nx-campo"><span>Settore</span><select class="g-f-n">' + sel.innerHTML + "</select></label>" +
        '<div class="nx-campo"><span>Layout</span><div class="nx-seg pieno g-f-s" role="group" aria-label="Layout"><button type="button" data-v="a">A</button><button type="button" data-v="b">B</button><button type="button" data-v="c">C</button><button type="button" data-v="d">D</button></div></div>' +
        '<ul class="nx-lista"><li><label class="nx-cella nx-toggle" style="justify-content:space-between"><span>Tema scuro</span><input type="checkbox" class="g-f-t"><i></i></label></li><li><label class="nx-cella nx-toggle" style="justify-content:space-between"><span>Effetto vetro</span><input type="checkbox" class="g-f-v"><i></i></label></li></ul>' +
        '<p class="g-ia-n" style="margin-top:16px">Attività inventata, dati di esempio. Le modifiche restano solo in questo browser.</p>'
    });
    var s = f.querySelector(".g-f-n"); s.value = nicchia;
    s.addEventListener("change", function () { cambiaNicchia(s.value); });
    f.querySelectorAll(".g-f-s button").forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-v") === stile ? "true" : "false"); });
    NX.seg(f.querySelector(".g-f-s"), function (v) { stile = v; applicaStile(); scriviUrl(); });
    NX.pref.collega(f.querySelector(".g-f-t"), "tema");
    NX.pref.collega(f.querySelector(".g-f-v"), "vetro");
  });

  /* ---------- eventi ---------- */
  window.addEventListener("hashchange", function () { mostra(true); scriviUrl(); window.scrollTo(0, 0); NX.foglio.chiudi(); });
  d.getElementById("g-tab").addEventListener("click", function (e) {
    if (!e.target.closest("#g-altro")) return;
    var resto = viste.slice(4);
    var f = NX.foglio.apri({ titolo: "Altre sezioni", html: '<ul class="nx-lista">' + resto.map(function (v) { return '<li><a class="nx-cella ic" href="#' + v.id + '"><span class="nx-c-ic">' + svg(v.ic) + '</span><span class="nx-c-tx"><b>' + esc(v.nome) + '</b></span><i class="nx-chev"></i></a></li>'; }).join("") + "</ul>" });
    f.addEventListener("click", function (ev) { if (ev.target.closest("a")) NX.foglio.chiudi(f); });
  });
  d.getElementById("cerca").addEventListener("input", function () {
    var v = this.value.trim().toLowerCase(), vis = 0;
    d.querySelectorAll("#vista [data-q]").forEach(function (el) { var ok = !v || el.getAttribute("data-q").indexOf(v) >= 0; el.hidden = !ok; if (ok) vis++; });
  });
  var vista = d.getElementById("vista");
  vista.addEventListener("change", function (e) { if (e.target.matches(".g-check input")) contaCheck(); });
  vista.addEventListener("click", function (e) {
    var t = e.target.closest("[data-az]"), sez = e.target.closest("[data-k]");
    if (!t || !sez) {
      if (e.target.closest('[data-nx-azione="tutti"]') && sez) { BL[+sez.getAttribute("data-k")]._f = "tutti"; ridisegna(+sez.getAttribute("data-k")); }
      return;
    }
    var k = +sez.getAttribute("data-k"), b = BL[k], az = t.getAttribute("data-az"), i = +t.getAttribute("data-i");
    if (az === "filtro") { b._f = t.getAttribute("data-f"); ridisegna(k); var s2 = d.querySelector('#vista [data-k="' + k + '"] .g-tw, #vista [data-k="' + k + '"] .g-tl'); if (s2) s2.classList.add("nx-entra"); return; }
    if (az === "riga") { esegui(b, k, i); return; }
    if (az === "apri") { apriRiga(b, k, i); return; }
    if (az === "esp") { esporta(b); return; }
    if (az === "imp") { importaTab(b, k); return; }
    if (az === "cella") { apriCella(b, k, i); return; }
    if (az === "ia") { apriIA(b); return; }
    if (az === "ev") { NX.foglio.apri({ titolo: t.getAttribute("data-t"), html: '<p style="margin:0 0 16px;color:var(--nx-tx2)">' + esc(t.getAttribute("data-s")) + '</p><div style="display:flex;gap:10px;flex-wrap:wrap"><button type="button" class="nx-btn p" data-chiudi>Segna arrivato</button><button type="button" class="nx-btn" data-chiudi>Sposta</button></div>' }).addEventListener("click", function (ev) { if (ev.target.closest("[data-chiudi]")) { NX.foglio.chiudi(); NX.toast("Fatto: nella demo l'agenda non cambia."); } }); }
  });

  function esegui(b, k, i) {
    var r = b.r[i], ultima = b.c.length - 1;
    if (b.incassi) {
      N[nicchia].incassi.voci[i][4] = "ok";
      mostra(false);
      NX.toast(r[0] + ": " + puro(r[2]) + " segnati come incassati.");
      return;
    }
    r[ultima] = b.azione.a; ridisegna(k);
    NX.toast(r[0] + ": " + puro(b.azione.a).toLowerCase() + ".");
  }
  function apriRiga(b, k, i) {
    var r = b.r[i], ultima = b.c.length - 1, az = b.azione;
    var f = NX.foglio.apri({
      titolo: puro(r[0]),
      html: '<ul class="nx-lista">' + b.c.slice(1).map(function (c, j) { var v = r[j + 1]; return '<li><div class="nx-cella"><span class="nx-c-tx"><small style="margin:0">' + tx(c) + "</small><b>" + (pill(v) || tx(v)) + "</b></span></div></li>"; }).join("") + "</ul>",
      piede: az && r[ultima] !== az.a ? '<button type="button" class="nx-btn p g-f-az">' + esc(az.l) + "</button>" : null
    });
    var bt = f.querySelector(".g-f-az");
    if (bt) bt.addEventListener("click", function () { NX.foglio.chiudi(f); esegui(b, k, i); });
  }
  function esporta(b) {
    NX.csv.scarica(b.esporta, [b.c.map(txt)].concat(b.r.map(function (r) { return r.map(puro); })));
    NX.toast("Esportate " + b.r.length + " righe in CSV.");
  }
  function importaTab(b, k) {
    var cols = b.c.slice(0, -1);
    NX.importa({
      titolo: "Importa " + b.imp.cosa, cosa: b.imp.cosa,
      campi: cols.map(function (c, j) { return { k: "c" + j, l: c, obbl: j === 0 }; }),
      esempio: NX.csv.scrivi([cols].concat(b.imp.es.map(function (r) { return r.map(txt); }))),
      onConferma: function (rows) {
        rows.forEach(function (o) { b.r.unshift(cols.map(function (_, j) { return o["c" + j] || "—"; }).concat(["info|Importato"])); });
        b._f = "tutti"; ridisegna(k);
        return rows.length;
      }
    });
  }
  function apriCella(b, k, i) {
    var r = b.r[i], stati = b.stati || [];
    var f = NX.foglio.apri({
      titolo: puro(r[0]),
      html: '<p style="margin:0 0 16px;color:var(--nx-tx2)">' + (tx(r[2]) || "Nessuna nota") + "</p>" +
        (stati.length ? '<div class="nx-campo"><span>Cambia lo stato</span><div class="nx-chips g-f-st" role="group" aria-label="Stato">' + stati.map(function (s) { return '<button type="button" class="nx-chip" data-s="' + esc(s) + '" aria-pressed="' + (puro(s) === puro(r[1])) + '">' + esc(puro(s)) + "</button>"; }).join("") + "</div></div>" : "")
    });
    f.addEventListener("click", function (e) {
      var c = e.target.closest(".g-f-st .nx-chip"); if (!c) return;
      r[1] = c.getAttribute("data-s"); ridisegna(k); NX.foglio.chiudi(f);
      NX.toast(puro(r[0]) + ": " + puro(r[1]).toLowerCase() + ".");
    });
  }
  function apriIA(b) {
    var testo = txt(b.bozza || b.p);
    var f = NX.foglio.apri({
      titolo: b.h,
      html: '<p class="g-ia-tag"><span class="g-ia-l">' + svg("spark") + 'IA</span>Testo di esempio, scritto per questa demo</p><div class="g-bozza">' + esc(testo).replace(/\n/g, "<br>") + '</div><p class="g-ia-n">In uso reale l\'IA prepara la bozza con i vostri dati; una persona la controlla prima di mandarla.</p>',
      piede: '<button type="button" class="nx-btn g-f-copia">' + svg("copia") + 'Copia il testo</button><button type="button" class="nx-btn p g-f-ok">Va bene</button>'
    });
    f.querySelector(".g-f-copia").addEventListener("click", function () {
      var ok = function () { NX.toast("Testo copiato."); }, ko = function () { NX.toast("Non riesco a copiare: seleziona il testo a mano.", "no"); };
      try { navigator.clipboard.writeText(testo).then(ok, ko); } catch (e) { ko(); }
    });
    f.querySelector(".g-f-ok").addEventListener("click", function () { NX.foglio.chiudi(f); });
  }

  applicaStile(); preparaNicchia(); scriviUrl(); mostra(false);
  NX.titoloGrande(d.getElementById("g-top"), 40);
  d.documentElement.classList.add("g-pronto");
})();
