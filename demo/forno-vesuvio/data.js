/* Forno Vesuvio - dati condivisi tra sito e pannello ordini.
   Demo: tutto resta nel browser (localStorage). Nessun dato viene inviato. */
(function () {
  "use strict";

  var ALLERGENI = {
    glu: "Glutine", lat: "Latte", uov: "Uova", pes: "Pesce", fru: "Frutta a guscio",
    sed: "Sedano", sol: "Solfiti", soi: "Soia", ses: "Sesamo", sen: "Senape"
  };

  var CATEGORIE = [
    { id: "classiche", nome: "Classiche" },
    { id: "speciali", nome: "Speciali" },
    { id: "fritti", nome: "Fritti" },
    { id: "bevande", nome: "Bevande" }
  ];

  // foto: solo per i piatti fotografati; gli altri hanno il disegno.
  var MENU = [
    { id: "margherita", cat: "classiche", nome: "Margherita", prezzo: 6.0, foto: "img/margherita.webp",
      ingr: "Pomodoro San Marzano, fior di latte, basilico, olio extravergine", all: ["glu", "lat"], pz: { salsa: "rossa", formaggio: "fiordilatte", top: ["basilico"] } },
    { id: "marinara", cat: "classiche", nome: "Marinara", prezzo: 5.0,
      ingr: "Pomodoro, aglio, origano, olio extravergine", all: ["glu"], veg: true, pz: { salsa: "rossa", formaggio: "nessuno", top: [] } },
    { id: "diavola", cat: "classiche", nome: "Diavola", prezzo: 7.5, foto: "img/diavola.webp",
      ingr: "Pomodoro, fior di latte, salame piccante, peperoncino", all: ["glu", "lat"], pz: { salsa: "rossa", formaggio: "fiordilatte", top: ["salame"] } },
    { id: "capricciosa", cat: "classiche", nome: "Capricciosa", prezzo: 8.5,
      ingr: "Pomodoro, fior di latte, prosciutto cotto, funghi, carciofini, olive nere", all: ["glu", "lat"], pz: { salsa: "rossa", formaggio: "fiordilatte", top: ["prosciutto", "funghi", "carciofi", "olive"] } },
    { id: "napoli", cat: "classiche", nome: "Napoli", prezzo: 7.0,
      ingr: "Pomodoro, fior di latte, alici, capperi, origano", all: ["glu", "lat", "pes"], pz: { salsa: "rossa", formaggio: "fiordilatte", top: ["acciughe"] } },
    { id: "cosacca", cat: "classiche", nome: "Cosacca", prezzo: 6.0,
      ingr: "Pomodoro, pecorino romano, basilico, olio extravergine", all: ["glu", "lat"], pz: { salsa: "rossa", formaggio: "nessuno", top: ["basilico"] } },

    { id: "friarielli", cat: "speciali", nome: "Salsiccia e friarielli", prezzo: 9.0, foto: "img/friarielli.webp",
      ingr: "Provola affumicata, friarielli saltati, salsiccia di maiale, olio", all: ["glu", "lat"], pz: { salsa: "bianca", formaggio: "provola", top: ["friarielli", "salsiccia"] } },
    { id: "bufalina", cat: "speciali", nome: "Bufalina", prezzo: 9.0,
      ingr: "Pomodorini, mozzarella di bufala campana aggiunta in uscita, basilico", all: ["glu", "lat"], pz: { salsa: "rossa", formaggio: "bufala", top: ["pomodorini", "basilico"] } },
    { id: "gialla", cat: "speciali", nome: "Gialla del Vesuvio", prezzo: 9.5,
      ingr: "Pomodorino giallo, fior di latte, ricotta, basilico", all: ["glu", "lat"], pz: { salsa: "giallo", formaggio: "fiordilatte", top: ["ricotta", "basilico"] } },
    { id: "calabrese", cat: "speciali", nome: "Calabrese", prezzo: 9.0,
      ingr: "Pomodoro, fior di latte, 'nduja, cipolla rossa, olive nere", all: ["glu", "lat"], pz: { salsa: "rossa", formaggio: "fiordilatte", top: ["nduja", "cipolla", "olive"] } },
    { id: "ortolana", cat: "speciali", nome: "Ortolana", prezzo: 8.5,
      ingr: "Fior di latte, peperoni, funghi, carciofini, rucola in uscita", all: ["glu", "lat"], veg: true, pz: { salsa: "bianca", formaggio: "fiordilatte", top: ["peperoni", "funghi", "carciofi", "rucola"] } },

    { id: "frittatina", cat: "fritti", nome: "Frittatina di pasta", prezzo: 3.0, foto: "img/fritti.webp",
      ingr: "Bucatini, besciamella, piselli, prosciutto cotto, impanata e fritta", all: ["glu", "lat", "uov"] },
    { id: "arancino", cat: "fritti", nome: "Arancino al ragù", prezzo: 3.0,
      ingr: "Riso, ragù di carne, piselli, provola", all: ["glu", "lat", "uov", "sed"] },
    { id: "crocche", cat: "fritti", nome: "Crocchè di patate", prezzo: 1.5,
      ingr: "Patate, provola, prezzemolo, pangrattato", all: ["glu", "lat", "uov"], veg: true },
    { id: "montanarina", cat: "fritti", nome: "Montanarina", prezzo: 2.5,
      ingr: "Pizzetta fritta con pomodoro, parmigiano e basilico", all: ["glu", "lat"], veg: true },
    { id: "cuoppo", cat: "fritti", nome: "Cuoppo misto", prezzo: 7.0,
      ingr: "Due frittatine, due crocchè, un arancino, zeppoline", all: ["glu", "lat", "uov", "sed"] },

    { id: "acqua", cat: "bevande", nome: "Acqua naturale o frizzante 50 cl", prezzo: 1.5, ingr: "In bottiglia", all: [] },
    { id: "cola", cat: "bevande", nome: "Bibita alla cola 33 cl", prezzo: 2.5, ingr: "In lattina", all: [] },
    { id: "limonata", cat: "bevande", nome: "Limonata artigianale 27,5 cl", prezzo: 3.0, ingr: "Limoni della costiera, in vetro", all: [] },
    { id: "birra", cat: "bevande", nome: "Birra chiara artigianale 33 cl", prezzo: 4.5, ingr: "Alc. 5%", all: ["glu"] },
    { id: "vino", cat: "bevande", nome: "Calice di rosso campano", prezzo: 4.0, ingr: "Aglianico, servito al tavolo o in bottiglietta da asporto", all: ["sol"] }
  ];

  // Componi la tua pizza
  var COMPONI = {
    impasti: [
      { id: "classico", nome: "Classico", nota: "24 ore di lievitazione", prezzo: 0 },
      { id: "integrale", nome: "Integrale", nota: "Farina di tipo 1 e crusca", prezzo: 1.0 },
      { id: "senzaglutine", nome: "Senza glutine", nota: "Preparato a parte", prezzo: 2.5 }
    ],
    misure: [
      { id: "baby", nome: "Baby", nota: "26 cm", prezzo: 5.0, scala: 0.8 },
      { id: "normale", nome: "Normale", nota: "32 cm", prezzo: 6.5, scala: 0.9 },
      { id: "maxi", nome: "Maxi", nota: "40 cm", prezzo: 9.5, scala: 1 }
    ],
    salse: [
      { id: "rossa", nome: "Pomodoro San Marzano", prezzo: 0 },
      { id: "giallo", nome: "Pomodorino giallo", prezzo: 1.0 },
      { id: "bianca", nome: "Bianca, solo olio", prezzo: 0 }
    ],
    formaggi: [
      { id: "fiordilatte", nome: "Fior di latte", prezzo: 0, all: ["lat"] },
      { id: "bufala", nome: "Bufala campana", prezzo: 2.0, all: ["lat"] },
      { id: "provola", nome: "Provola affumicata", prezzo: 1.0, all: ["lat"] },
      { id: "nessuno", nome: "Senza formaggio", prezzo: 0, all: [] }
    ],
    cotture: [
      { id: "classica", nome: "Classica", nota: "Morbida, come a Napoli" },
      { id: "bencotta", nome: "Ben cotta", nota: "Bordo più croccante" },
      { id: "tagliata", nome: "Tagliata a spicchi", nota: "Comoda da asporto" }
    ],
    // ordine = ordine degli strati sulla pizza (dal basso verso l'alto)
    ingredienti: [
      { id: "salsiccia", nome: "Salsiccia", prezzo: 2.0, n: 15 },
      { id: "salame", nome: "Salame piccante", prezzo: 1.5, n: 9 },
      { id: "prosciutto", nome: "Prosciutto cotto", prezzo: 1.5, n: 7 },
      { id: "nduja", nome: "'Nduja", prezzo: 1.5, n: 8 },
      { id: "funghi", nome: "Funghi champignon", prezzo: 1.0, n: 10 },
      { id: "peperoni", nome: "Peperoni", prezzo: 1.0, n: 11 },
      { id: "cipolla", nome: "Cipolla rossa", prezzo: 0.5, n: 10 },
      { id: "carciofi", nome: "Carciofini", prezzo: 1.5, n: 8 },
      { id: "friarielli", nome: "Friarielli", prezzo: 2.0, n: 9 },
      { id: "pomodorini", nome: "Pomodorini", prezzo: 1.0, n: 9 },
      { id: "olive", nome: "Olive nere", prezzo: 1.0, n: 14 },
      { id: "acciughe", nome: "Alici", prezzo: 1.5, n: 7, all: ["pes"] },
      { id: "ricotta", nome: "Ricotta", prezzo: 1.5, n: 7, all: ["lat"] },
      { id: "basilico", nome: "Basilico", prezzo: 0.5, n: 7 },
      { id: "rucola", nome: "Rucola in uscita", prezzo: 1.0, n: 16 }
    ],
    massimo: 8
  };

  // Orari di esempio: lunedì chiuso.
  var TURNI = [[12 * 60, 15 * 60], [19 * 60, 23 * 60 + 30]];
  function apertoIl(giorno) { return giorno !== 1; } // 1 = lunedì

  var ZONE = [
    { id: "centro", nome: "Centro storico", costo: 2.0 },
    { id: "chiaia", nome: "Chiaia e lungomare", costo: 2.5 },
    { id: "vomero", nome: "Vomero e Arenella", costo: 3.0 }
  ];
  var MINIMO_CONSEGNA = 12;

  var STATI = ["ricevuto", "preparazione", "forno", "uscita", "chiuso"];
  function nomeStato(s, modo) {
    return {
      ricevuto: "Ricevuto", preparazione: "In preparazione", forno: "In forno",
      uscita: modo === "consegna" ? "In consegna" : "Pronto al banco",
      chiuso: modo === "consegna" ? "Consegnato" : "Ritirato", annullato: "Annullato"
    }[s] || s;
  }

  // ---------- archivio nel browser ----------
  var mem = {};
  function leggi(k, def) {
    try { var v = localStorage.getItem("fv_" + k); return v ? JSON.parse(v) : def; }
    catch (e) { return k in mem ? mem[k] : def; }
  }
  function scrivi(k, v) {
    mem[k] = v;
    try { localStorage.setItem("fv_" + k, JSON.stringify(v)); } catch (e) { /* modalità privata: resta in memoria */ }
  }

  function euro(n) { return "€ " + (Math.round(n * 100) / 100).toFixed(2).replace(".", ","); }
  function trova(lista, id) { for (var i = 0; i < lista.length; i++) if (lista[i].id === id) return lista[i]; return null; }
  function hhmm(min) { return String(Math.floor(min / 60)).padStart(2, "0") + ":" + String(min % 60).padStart(2, "0"); }
  function oggiChiave(d) { d = d || new Date(); return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); }

  // Prezzo di una pizza composta
  function prezzoPizza(c) {
    var p = trova(COMPONI.misure, c.misura).prezzo;
    p += trova(COMPONI.impasti, c.impasto).prezzo;
    p += trova(COMPONI.salse, c.salsa).prezzo;
    p += trova(COMPONI.formaggi, c.formaggio).prezzo;
    c.top.forEach(function (id) { p += trova(COMPONI.ingredienti, id).prezzo; });
    return Math.round(p * 100) / 100;
  }

  // Fasce orarie: ogni 15 minuti dentro i turni, prima possibile = ora + preparazione
  function fasce(modo, adesso) {
    adesso = adesso || new Date();
    var anticipo = modo === "consegna" ? 45 : 30, out = [];
    for (var g = 0; g < 7 && out.length < 18; g++) {
      var d = new Date(adesso.getFullYear(), adesso.getMonth(), adesso.getDate() + g);
      if (!apertoIl(d.getDay())) continue;
      var minimo = g === 0 ? adesso.getHours() * 60 + adesso.getMinutes() + anticipo : 0;
      TURNI.forEach(function (t) {
        var inizio = t[0] + (modo === "consegna" ? 15 : 0);
        for (var m = inizio; m <= t[1]; m += 15) {
          if (m < minimo || out.length >= 18) continue;
          var giorno = g === 0 ? "Oggi" : g === 1 ? "Domani" : d.toLocaleDateString("it-IT", { weekday: "long" });
          out.push({ valore: oggiChiave(d) + " " + hhmm(m), etichetta: giorno + " alle " + hhmm(m), giorno: giorno, ora: hhmm(m) });
        }
      });
    }
    return out;
  }

  // Stato del locale adesso, per il cartello in alto
  function statoLocale(adesso) {
    adesso = adesso || new Date();
    var m = adesso.getHours() * 60 + adesso.getMinutes();
    if (apertoIl(adesso.getDay())) {
      for (var i = 0; i < TURNI.length; i++) {
        if (m >= TURNI[i][0] && m < TURNI[i][1]) return { aperto: true, testo: "Forno acceso fino alle " + hhmm(TURNI[i][1]) };
        if (m < TURNI[i][0]) return { aperto: false, testo: "Accendiamo il forno alle " + hhmm(TURNI[i][0]) + ". Puoi già ordinare." };
      }
    }
    return { aperto: false, testo: "Ora siamo chiusi. Puoi ordinare per il prossimo turno." };
  }

  // Avanzamento automatico degli ordini (solo per la demo), finché il titolare non interviene
  var PASSI_AUTO = [["preparazione", 25], ["forno", 55], ["uscita", 110]];
  function avanzaAuto() {
    var ordini = leggi("ordini", []), cambiato = false, ora = Date.now();
    var auto = leggi("impostazioni", { auto: true }).auto !== false;
    if (!auto) return ordini;
    ordini.forEach(function (o) {
      if (!o.auto || o.stato === "chiuso" || o.stato === "annullato") return;
      var sec = (ora - o.creato) / 1000, nuovo = "ricevuto";
      PASSI_AUTO.forEach(function (p) { if (sec >= p[1]) nuovo = p[0]; });
      if (STATI.indexOf(nuovo) > STATI.indexOf(o.stato)) { o.stato = nuovo; o.storia.push({ stato: nuovo, t: ora }); cambiato = true; }
    });
    if (cambiato) scrivi("ordini", ordini);
    return ordini;
  }

  function nuovoNumero() {
    var c = leggi("contatore", { giorno: "", n: 100 });
    if (c.giorno !== oggiChiave()) c = { giorno: oggiChiave(), n: 100 };
    c.n += 1; scrivi("contatore", c);
    return "FV-" + c.n;
  }

  function descriviRiga(r) {
    if (r.tipo === "composta") {
      var c = r.composta, parti = [];
      parti.push(trova(COMPONI.misure, c.misura).nome + " " + trova(COMPONI.misure, c.misura).nota);
      parti.push("impasto " + trova(COMPONI.impasti, c.impasto).nome.toLowerCase());
      parti.push(trova(COMPONI.salse, c.salsa).nome.toLowerCase());
      parti.push(trova(COMPONI.formaggi, c.formaggio).nome.toLowerCase());
      if (c.top.length) parti.push(c.top.map(function (id) { return trova(COMPONI.ingredienti, id).nome.toLowerCase(); }).join(", "));
      parti.push("cottura " + trova(COMPONI.cotture, c.cottura).nome.toLowerCase());
      return parti.join(" · ");
    }
    return r.extra && r.extra.length ? r.extra.join(" · ") : "";
  }

  window.FV = {
    ALLERGENI: ALLERGENI, CATEGORIE: CATEGORIE, MENU: MENU, COMPONI: COMPONI, TURNI: TURNI, ZONE: ZONE,
    MINIMO_CONSEGNA: MINIMO_CONSEGNA, STATI: STATI, nomeStato: nomeStato, apertoIl: apertoIl,
    leggi: leggi, scrivi: scrivi, euro: euro, trova: trova, hhmm: hhmm, oggiChiave: oggiChiave,
    prezzoPizza: prezzoPizza, fasce: fasce, statoLocale: statoLocale, avanzaAuto: avanzaAuto,
    nuovoNumero: nuovoNumero, descriviRiga: descriviRiga
  };
})();
