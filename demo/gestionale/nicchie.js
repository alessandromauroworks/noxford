/* Dati di esempio del motore di gestionali Noxford (v2, 17/11/2026). Tutto inventato: nomi, importi, appuntamenti.
   Blocchi (t):
   kpi    {v:[[etichetta, valore, nota, "su|giu"]]}
   lista  {h, r:[[ora, titolo, sotto, "tono|Testo"]]}                       agenda a righe
   tab    {h, c:[colonne], r:[[celle]], filtro, azione:{l, a:"ok|Testo"}, esporta:"file.csv", imp:{cosa, es:[[...]]}}
   celle  {h, r:[[nome, "tono|Stato", nota]], stati:["ok|Libero", ...]}   riquadri cliccabili
   agenda {h, ris:[risorse], da:8, a:19, ev:[[risorsa, inizio(ore), durata(ore), titolo, sotto, tono]]}
   scad   {h, r:[[giorni da oggi, titolo, sotto, "tono|Stato"]]}           scadenze con conto alla rovescia
   avanz  {h, r:[[nome, %, nota]]}   barre {h, v:[[etichetta, numero]], u}   check {h, r:[[testo, nota]]}
   ia     {h, p:testo, a:[pulsanti], bozza:testo}                          sempre dichiarato come esempio
   toni: ok (verde), wait (arancio), no (rosso), acc (colore del brand), info (blu), "" (grigio).
   w: larghezza "s" | "m" | "l" | "f".  "@d+N" = data di oggi più N giorni.
   Ogni nicchia: viste (una con crm:true), crm, incassi, foto = viste delle 4 schermate del portfolio. */
window.NICCHIE = {

  commercialista: {
    nome: "Studio Esempio Associati", settore: "Studio commercialista", sigla: "SA", tinta: "#2F5F9E", utente: "GR",
    foto: ["scadenze", "f24", "clienti", "incassi"],
    viste: [
      { id: "scadenze", nome: "Scadenze", ic: "cal", b: [
        { t: "kpi", v: [["Scadenze entro 7 giorni", "23", "9 per il 30 novembre"], ["F24 da preparare", "14", "6 senza i dati"], ["Documenti mancanti", "11", "da 7 clienti"], ["Parcelle da incassare", "8.940 €", "12 clienti"]] },
        { t: "scad", w: "l", h: "Scadenze fiscali", r: [[0, "Invio Lipe 3° trimestre", "Bar Centrale, Ferramenta Riva e altri 4", "acc|In corso"], [2, "Versamento IVA mensile", "8 clienti · F24 pronti 6 di 8", "wait|2 da preparare"], [6, "Acconto IRPEF e cedolare", "21 clienti · secondo acconto", "wait|In preparazione"], [12, "Imposta di bollo e-fatture", "15 clienti", "ok|Pronto"], [28, "Acconto IVA", "34 clienti", "|Da iniziare"]] },
        { t: "ia", w: "s", h: "Riepilogo della settimana", p: "Il 30 novembre è la settimana più carica: 21 acconti. Mancano i dati di 6 clienti; i tre più in ritardo sono Bar Centrale, Studio Neri e Moda Fiore. Conviene scrivere a loro oggi.", a: ["Prepara i solleciti"], bozza: "Buongiorno, per preparare il suo F24 dell'acconto in scadenza il 30 novembre ci servono gli estratti conto di ottobre. Può caricarli entro venerdì dal link che le abbiamo mandato? Grazie, Studio Esempio Associati." },
        { t: "check", w: "m", h: "Promemoria dello studio", r: [["Chiudere le Lipe entro stasera", "6 clienti rimasti"], ["Richiamare Moda Fiore", "estratti conto di ottobre"], ["Controllare le deleghe F24 scadute", "3 clienti"]] },
        { t: "barre", w: "m", h: "Pratiche chiuse, ultimi 6 mesi", u: "", v: [["giu", 212], ["lug", 248], ["ago", 96], ["set", 231], ["ott", 266], ["nov", 189]] }] },
      { id: "f24", nome: "F24", ic: "receipt", b: [
        { t: "kpi", v: [["Da preparare", "14", "entro il 30/11"], ["Pronti da inviare", "9", "in attesa di firma"], ["Pagati a novembre", "126", "tutti con quietanza"]] },
        { t: "tab", w: "f", h: "F24 di novembre", filtro: true, esporta: "f24-novembre.csv", c: ["Cliente", "Tributo", "Importo", "Scadenza", "Stato"],
          azione: { l: "Segna pagato", a: "ok|Pagato" },
          imp: { cosa: "F24", es: [["Bar Centrale srl", "IVA mensile 6011", "1.840 €", "@d+2"], ["Ferramenta Riva", "IVA mensile 6011", "920 €", "@d+2"], ["Dott. Leone", "Acconto IRPEF 4034", "3.200 €", "@d+12"], ["Moda Fiore snc", "Acconto IRES 2002", "2.150 €", "@d+12"]] },
          r: [["Bar Centrale srl", "IVA mensile · 6011", "1.840 €", "@d+2", "wait|Da preparare"], ["Ferramenta Riva", "IVA mensile · 6011", "920 €", "@d+2", "acc|Pronto"], ["Studio Neri", "Acconto IRPEF · 4034", "4.310 €", "@d+12", "wait|Da preparare"], ["Moda Fiore snc", "Acconto IRES · 2002", "2.150 €", "@d+12", "no|Mancano i dati"], ["Autofficina Greco", "Ritenute · 1001", "640 €", "@d-2", "ok|Pagato"], ["Dott.ssa Bruni", "Cedolare secca · 1841", "1.120 €", "@d+12", "acc|Pronto"], ["Panificio Gallo", "INPS artigiani", "1.065 €", "@d-2", "ok|Pagato"], ["Agriturismo Colle", "IVA mensile · 6011", "2.480 €", "@d+2", "wait|Da preparare"]] },
        { t: "ia", w: "m", h: "Controllo F24 con IA", p: "Ho confrontato gli F24 pronti con i mesi scorsi: l'IVA della Ferramenta Riva è il 40% più bassa di ottobre. Può essere giusto (meno vendite), ma conviene ricontrollare le fatture di acquisto.", a: ["Apri il controllo"], bozza: "Ferramenta Riva · IVA di novembre 920 € contro 1.530 € di ottobre (−40%). Fatture di acquisto registrate: 31 (ottobre 18). Da verificare: due fatture di acquisto da 2.400 € registrate due volte?" },
        { t: "check", w: "m", h: "Prima dell'invio", r: [["Deleghe di pagamento firmate", "9 su 9"], ["Codici tributo controllati", "fatto da Giulia"], ["Quietanze archiviate nel fascicolo", "dopo il pagamento"]] }] },
      { id: "documenti", nome: "Documenti", breve: "Documenti", ic: "folder", b: [
        { t: "tab", w: "l", h: "Documenti da ricevere", filtro: true, c: ["Cliente", "Documento", "Richiesto", "Stato"], azione: { l: "Segna ricevuto", a: "ok|Ricevuto" },
          r: [["Moda Fiore snc", "Estratti conto ottobre", "@d-9", "no|Sollecitato 2 volte"], ["Studio Neri", "Fatture di acquisto", "@d-5", "wait|In attesa"], ["Bar Centrale srl", "Corrispettivi ottobre", "@d-4", "wait|In attesa"], ["Dott. Leone", "Spese mediche 2026", "@d-2", "ok|Ricevuto"], ["Agriturismo Colle", "Contratti di affitto", "@d-1", "wait|In attesa"]] },
        { t: "ia", w: "s", h: "Lettura documenti con IA", p: "Dal PDF caricato da Bar Centrale: 42 scontrini giornalieri, totale 38.920 €. Un giorno manca (12 ottobre). Le cifre vanno controllate prima di registrarle.", a: ["Vedi i dati letti"], bozza: "Corrispettivi ottobre · Bar Centrale srl\nGiorni letti: 30 di 31 (manca il 12/10)\nTotale: 38.920 € · IVA 10%: 3.538 €\nDa controllare a mano prima della registrazione." },
        { t: "celle", w: "f", h: "Fascicoli per cliente", stati: ["ok|Completo", "wait|Incompleto", "no|Bloccato"], r: [["Bar Centrale srl", "wait|Incompleto", "manca 1 documento"], ["Ferramenta Riva", "ok|Completo", "aggiornato oggi"], ["Studio Neri", "wait|Incompleto", "mancano le fatture"], ["Moda Fiore snc", "no|Bloccato", "senza estratti conto"], ["Dott. Leone", "ok|Completo", "aggiornato ieri"], ["Panificio Gallo", "ok|Completo", "aggiornato @d-3"]] }] },
      { id: "clienti", nome: "Clienti", ic: "people", crm: true }
    ],
    crm: {
      nome: "Clienti", sing: "cliente", plur: "clienti", nomeCol: "Cliente",
      fasi: ["Contatto", "Preventivo", "Attivo", "Da sollecitare", "Chiuso"], toni: ["info", "acc", "ok", "wait", ""],
      campi: [{ k: "regime", l: "Regime", alias: ["tipo", "contabilita"] }],
      dati: [
        { nome: "Bar Centrale srl", tel: "333 412 7781", email: "amministrazione@barcentrale.example", fase: "Da sollecitare", ultimo: 4, regime: "Ordinario", note: ["Mancano i corrispettivi di ottobre"] },
        { nome: "Ferramenta Riva", tel: "347 098 2214", email: "riva@ferramenta.example", fase: "Attivo", ultimo: 0, regime: "Semplificato", note: ["F24 IVA pronto"] },
        { nome: "Studio Neri", tel: "320 771 0943", email: "neri@studio.example", fase: "Attivo", ultimo: 5, regime: "Forfettario", note: [] },
        { nome: "Moda Fiore snc", tel: "349 230 1158", email: "fiore@moda.example", fase: "Da sollecitare", ultimo: 9, regime: "Ordinario", note: ["Sollecitati due volte gli estratti conto"] },
        { nome: "Dott. Paolo Leone", tel: "338 554 9021", email: "p.leone@example.it", fase: "Attivo", ultimo: 2, regime: "Forfettario", note: [] },
        { nome: "Agriturismo Colle", tel: "331 867 4410", email: "info@colle.example", fase: "Preventivo", ultimo: 1, regime: "Agricolo", note: ["Vuole passare a noi da gennaio"] },
        { nome: "Elena Marini", tel: "329 145 6672", email: "elena.marini@example.it", fase: "Contatto", ultimo: 0, regime: "Da capire", note: ["Apre partita IVA come grafica"] },
        { nome: "Panificio Gallo", tel: "345 602 3398", email: "gallo@panificio.example", fase: "Attivo", ultimo: 3, regime: "Semplificato", note: [] }
      ],
      esempio: [["Nome", "Telefono", "Email", "Regime", "Fase", "Note"], ["Officina Bassi", "333 101 2020", "bassi@officina.example", "Semplificato", "Contatto", "Chiede un preventivo"], ["Gelateria Polo", "347 303 4040", "polo@gelateria.example", "Forfettario", "Preventivo", ""], ["Arch. Serra", "320 505 6060", "serra@studio.example", "Forfettario", "Attivo", "Passa da noi a gennaio"], ["B&B Il Mandorlo", "349 707 8080", "mandorlo@bb.example", "Ordinario", "Contatto", ""], ["Farmacia Viola", "338 909 1010", "viola@farmacia.example", "Ordinario", "Preventivo", "Due soci"]]
    },
    incassi: {
      base: 21400, voci: [["Bar Centrale srl", "Parcella 3° trimestre", 1450, -12, "no"], ["Moda Fiore snc", "Bilancio 2025", 2200, -3, "no"], ["Studio Neri", "Dichiarazione dei redditi", 380, 5, "wait"], ["Agriturismo Colle", "Consulenza avvio", 600, 10, "wait"], ["Ferramenta Riva", "Contabilità ottobre", 290, -5, "ok"], ["Dott. Paolo Leone", "Dichiarazione dei redditi", 380, -8, "ok"], ["Panificio Gallo", "Contabilità ottobre", 320, 2, "wait"], ["Autofficina Greco", "Paghe ottobre", 410, 15, "wait"]],
      mesi: [["giu", 24.1], ["lug", 26.8], ["ago", 11.2], ["set", 25.4], ["ott", 28.9], ["nov", 21.4]],
      pd: [["Parcelle pagate in ritardo", 41, 18, "con il promemoria automatico"], ["Ore al mese per cercare documenti", 22, 6, "fascicolo unico per cliente"], ["Scadenze scoperte all'ultimo", 12, 2, "avvisi a 15 e 5 giorni"]],
      ia: { h: "Sollecito gentile", p: "Bar Centrale ha la parcella del 3° trimestre scaduta da 12 giorni. Bozza pronta, con il link per pagare.", a: ["Apri il sollecito"], bozza: "Buongiorno, le ricordiamo la parcella del 3° trimestre (1.450 €) scaduta il mese scorso. Se ha già pagato non consideri questo messaggio. Grazie, Studio Esempio Associati." }
    }
  },

  avvocato: {
    nome: "Studio Legale Esempio", settore: "Studio legale", sigla: "SL", tinta: "#7D2E3E", utente: "AM",
    foto: ["oggi", "pratiche", "clienti", "incassi"],
    viste: [
      { id: "oggi", nome: "Oggi", ic: "home", b: [
        { t: "kpi", v: [["Udienze questa settimana", "6", "2 domani"], ["Termini in scadenza", "4", "entro 10 giorni"], ["Pratiche aperte", "58", "+3 questo mese"], ["Parcelle da incassare", "17.300 €", "9 clienti"]] },
        { t: "lista", w: "l", h: "Agenda di oggi", r: [["9:00", "Udienza · Tribunale di Napoli", "Ferri c/ Condominio Aurora · Sez. II civile", "ok|Rinviata al @d+60"], ["10:30", "Studio · Marco De Santis", "Prima consulenza, recupero crediti", "ok|Fatto"], ["11:00", "Videochiamata · Edil Esempio srl", "Contratto d'appalto, revisione", "acc|In corso"], ["15:00", "Deposito telematico", "Memoria 183 · Bianchi c/ Assicurazioni", "wait|Da firmare"], ["17:30", "Studio · Famiglia Russo", "Successione, firma del mandato", "|Confermato"]] },
        { t: "ia", w: "s", h: "Riepilogo del giorno", p: "Domani alle 9:30 udienza Marino c/ Banca Esempio: il fascicolo è completo ma manca la nota spese. Il termine per la memoria Bianchi scade tra 3 giorni: la bozza è al 70%.", a: ["Apri la checklist"], bozza: "Udienza Marino c/ Banca Esempio · domani 9:30, Tribunale di Napoli, aula 14\n✓ Fascicolo completo\n✗ Nota spese da preparare\n✓ Delega al collega firmata" },
        { t: "scad", w: "m", h: "Termini processuali", r: [[3, "Memoria art. 171-ter", "Bianchi c/ Assicurazioni Esempio", "wait|Bozza al 70%"], [5, "Comparsa conclusionale", "Ferri c/ Condominio Aurora", "acc|In scrittura"], [9, "Termine per l'appello", "Gallo c/ Comune", "no|Da decidere col cliente"], [21, "Repliche", "Ditta Neri c/ Fornitore", "|Da iniziare"]] },
        { t: "barre", w: "m", h: "Ore registrate, ultime 6 settimane", u: "", v: [["S1", 38], ["S2", 42], ["S3", 35], ["S4", 44], ["S5", 40], ["S6", 31]] }] },
      { id: "pratiche", nome: "Pratiche", ic: "scale", b: [
        { t: "kpi", v: [["Contenzioso civile", "31", "11 in decisione"], ["Stragiudiziale", "19", "6 trattative aperte"], ["Recupero crediti", "8", "124.000 € in totale"]] },
        { t: "tab", w: "f", h: "Pratiche aperte", filtro: true, esporta: "pratiche.csv", c: ["Pratica", "Materia", "Prossimo atto", "Avvocato", "Stato"],
          r: [["Bianchi c/ Assicurazioni Esempio", "RC auto", "Memoria · @d+3", "Avv. Mauri", "wait|Termine vicino"], ["Ferri c/ Condominio Aurora", "Condominio", "Conclusionale · @d+5", "Avv. Mauri", "acc|In decisione"], ["Gallo c/ Comune", "Amministrativo", "Appello · @d+9", "Avv. Riva", "no|Decisione del cliente"], ["Edil Esempio srl", "Contratti", "Revisione · oggi", "Avv. Riva", "acc|In corso"], ["Successione Russo", "Successioni", "Firma mandato · oggi", "Avv. Mauri", "info|Nuova"], ["Marino c/ Banca Esempio", "Bancario", "Udienza · @d+1", "Avv. Mauri", "acc|In corso"], ["Ditta Neri c/ Fornitore", "Recupero crediti", "Repliche · @d+21", "Avv. Riva", "ok|Regolare"]] },
        { t: "avanz", w: "m", h: "Fasi delle cause principali", r: [["Ferri c/ Condominio Aurora", 85, "precisazione delle conclusioni fatta"], ["Bianchi c/ Assicurazioni", 55, "istruttoria · CTU depositata"], ["Marino c/ Banca Esempio", 35, "prima udienza fatta"]] },
        { t: "ia", w: "m", h: "Riassunto del fascicolo con IA", p: "Bianchi c/ Assicurazioni: 47 documenti. In sintesi: sinistro del 14/03/2025, responsabilità contestata al 50%, CTU favorevole sul danno (18.400 €). Punto debole: testimone unico.", a: ["Leggi il riassunto"], bozza: "Bianchi c/ Assicurazioni Esempio · sintesi (esempio)\n1. Sinistro 14/03/2025, incrocio via Roma\n2. CTU: danno 18.400 €, nesso causale confermato\n3. Controparte: concorso di colpa al 50%\n4. Da rafforzare: un solo testimone\nIl riassunto va sempre verificato sugli atti." }] },
      { id: "documenti", nome: "Documenti", breve: "Atti", ic: "folder", b: [
        { t: "tab", w: "l", h: "Atti e documenti", filtro: true, c: ["Documento", "Pratica", "Data", "Stato"], azione: { l: "Segna depositato", a: "ok|Depositato" },
          r: [["Memoria 171-ter", "Bianchi c/ Assicurazioni", "@d+3", "wait|Da firmare"], ["Procura alle liti", "Successione Russo", "oggi", "wait|Da firmare"], ["Comparsa conclusionale", "Ferri c/ Condominio", "@d+5", "acc|In scrittura"], ["Nota spese", "Marino c/ Banca", "@d+1", "no|Mancante"], ["Atto di citazione", "Ditta Neri c/ Fornitore", "@d-40", "ok|Depositato"]] },
        { t: "check", w: "s", h: "Da firmare oggi", r: [["Memoria Bianchi", "firma digitale"], ["Procura Russo", "in studio alle 17:30"], ["Lettera di diffida", "Ditta Neri"]] },
        { t: "celle", w: "f", h: "Archivio per cliente", stati: ["ok|Completo", "wait|Da integrare", "no|Mancano atti"], r: [["Bianchi Lucia", "ok|Completo", "47 documenti"], ["Condominio Aurora", "ok|Completo", "controparte"], ["Gallo Antonio", "wait|Da integrare", "manca la delibera"], ["Edil Esempio srl", "ok|Completo", "contratto v3"], ["Famiglia Russo", "no|Mancano atti", "certificato di morte"], ["Marino Franco", "wait|Da integrare", "estratti conto"]] }] },
      { id: "clienti", nome: "Clienti", ic: "people", crm: true }
    ],
    crm: {
      nome: "Clienti", sing: "cliente", plur: "clienti", nomeCol: "Cliente",
      fasi: ["Primo contatto", "Consulenza", "Mandato firmato", "In causa", "Chiuso"], toni: ["info", "wait", "acc", "ok", ""],
      campi: [{ k: "materia", l: "Materia", alias: ["pratica", "oggetto"] }],
      dati: [
        { nome: "Lucia Bianchi", tel: "333 220 1874", email: "lucia.bianchi@example.it", fase: "In causa", ultimo: 1, materia: "RC auto", note: ["Aggiornata sulla CTU"] },
        { nome: "Marco De Santis", tel: "347 551 0912", email: "desantis@example.it", fase: "Consulenza", ultimo: 0, materia: "Recupero crediti", note: ["Fatture non pagate per 12.000 €"] },
        { nome: "Edil Esempio srl", tel: "081 555 0199", email: "legale@edilesempio.example", fase: "Mandato firmato", ultimo: 0, materia: "Contratti", note: [] },
        { nome: "Antonio Gallo", tel: "320 118 4467", email: "a.gallo@example.it", fase: "In causa", ultimo: 6, materia: "Amministrativo", note: ["Decidere entro 9 giorni se fare appello"] },
        { nome: "Famiglia Russo", tel: "349 773 2051", email: "russo.famiglia@example.it", fase: "Mandato firmato", ultimo: 2, materia: "Successioni", note: [] },
        { nome: "Franco Marino", tel: "338 640 9922", email: "f.marino@example.it", fase: "In causa", ultimo: 3, materia: "Bancario", note: [] },
        { nome: "Giulia Serra", tel: "331 902 7745", email: "giulia.serra@example.it", fase: "Primo contatto", ultimo: 0, materia: "Lavoro", note: ["Licenziamento, chiede un appuntamento"] },
        { nome: "Ditta Neri", tel: "081 555 7720", email: "neri@ditta.example", fase: "Chiuso", ultimo: 40, materia: "Recupero crediti", note: [] }
      ],
      esempio: [["Nome", "Telefono", "Email", "Materia", "Fase", "Note"], ["Carla Pace", "333 404 1212", "carla.pace@example.it", "Famiglia", "Primo contatto", "Separazione consensuale"], ["Officine Riva srl", "081 555 3030", "riva@officine.example", "Contratti", "Consulenza", ""], ["Luca Testa", "347 606 5656", "luca.testa@example.it", "Lavoro", "Primo contatto", ""], ["Condominio Pini", "081 555 7878", "pini@condominio.example", "Condominio", "Mandato firmato", "Infiltrazioni"]]
    },
    incassi: {
      base: 28600, voci: [["Lucia Bianchi", "Acconto fase istruttoria", 1800, -20, "no"], ["Edil Esempio srl", "Consulenza contratti", 2400, -6, "wait"], ["Famiglia Russo", "Fondo spese successione", 1500, 3, "wait"], ["Franco Marino", "Acconto causa", 2000, -2, "ok"], ["Ditta Neri", "Saldo recupero crediti", 3100, -10, "no"], ["Marco De Santis", "Prima consulenza", 150, 0, "ok"], ["Antonio Gallo", "Fase di appello", 3500, 14, "wait"]],
      mesi: [["giu", 31.2], ["lug", 27.5], ["ago", 9.8], ["set", 33.1], ["ott", 29.4], ["nov", 28.6]],
      pd: [["Parcelle incassate oltre 60 giorni", 46, 20, "acconti per fase e promemoria"], ["Termini segnati a mano", 100, 0, "tutti nel calendario condiviso"], ["Ore non fatturate", 18, 5, "registrazione ore per pratica"]],
      ia: { h: "Preavviso di parcella", p: "Ditta Neri: saldo di 3.100 € scaduto da 10 giorni. Bozza di messaggio cortese con il dettaglio delle attività svolte.", a: ["Apri la bozza"], bozza: "Gentile cliente, le inviamo il riepilogo delle attività svolte per il recupero del credito e il saldo di 3.100 €, scaduto il mese scorso. Restiamo a disposizione per qualsiasi chiarimento. Studio Legale Esempio." }
    }
  },

  dentista: {
    nome: "Studio Dentistico Esempio", settore: "Studio dentistico", sigla: "SD", tinta: "#2672B0", utente: "MR",
    foto: ["oggi", "poltrone", "pazienti", "incassi"],
    viste: [
      { id: "oggi", nome: "Oggi", ic: "home", b: [
        { t: "kpi", v: [["Pazienti oggi", "14", "3 prime visite"], ["Poltrone occupate", "2 di 3", "fino alle 13:00"], ["Piani di cura attivi", "31", "12.600 € a rate"], ["Richiami da fare", "22", "igiene scaduta"]] },
        { t: "lista", w: "l", h: "Agenda di oggi", r: [["9:00", "Marco Bellini", "Igiene · Poltrona 1 · Dott.ssa Neri", "ok|Fatto"], ["9:30", "Anna Russo", "Otturazione · Poltrona 2 · Dott. Vitale", "ok|Fatto"], ["10:30", "Luigi Pace", "Prima visita · Poltrona 3", "ok|Fatto"], ["11:00", "Carla Fiore", "Devitalizzazione · Poltrona 2", "acc|In poltrona"], ["11:00", "Pietro Sala", "Controllo apparecchio · Poltrona 1", "acc|In poltrona"], ["12:00", "Giada Marchi", "Sbiancamento · Poltrona 3", "|In sala d'attesa"], ["15:00", "Tommaso Gentile", "Impianto, 2ª fase · Poltrona 1", "|Confermato"]] },
        { t: "ia", w: "s", h: "Riepilogo del giorno", p: "Oggi 14 pazienti. La poltrona 3 è libera dalle 16 alle 18: conviene proporla ai 3 richiami più vecchi. Luigi Pace aspetta il preventivo promesso stamattina.", a: ["Proponi lo spazio libero"], bozza: "Buongiorno, si è liberato un posto oggi alle 16:00 per la sua igiene. Le va bene? Basta rispondere sì a questo messaggio. Studio Dentistico Esempio." },
        { t: "check", w: "m", h: "Promemoria", r: [["Ordinare le impronte digitali", "laboratorio, entro giovedì"], ["Preventivo a Luigi Pace", "promesso per oggi"], ["Sterilizzatrice: controllo mensile", "scade @d+2"]] },
        { t: "barre", w: "m", h: "Prime visite, ultimi 6 mesi", u: "", v: [["giu", 18], ["lug", 22], ["ago", 9], ["set", 24], ["ott", 27], ["nov", 19]] }] },
      { id: "poltrone", nome: "Poltrone", ic: "chair", b: [
        { t: "agenda", w: "f", h: "Poltrone, oggi", ris: ["Poltrona 1 · Dott.ssa Neri", "Poltrona 2 · Dott. Vitale", "Poltrona 3 · Dott.ssa Conti"], da: 9, a: 18,
          ev: [[0, 9, 1, "Marco Bellini", "Igiene", "ok"], [0, 11, 1, "Pietro Sala", "Controllo apparecchio", "acc"], [0, 15, 1.5, "Tommaso Gentile", "Impianto, 2ª fase", ""], [0, 17, 1, "Rita Moro", "Igiene", ""], [1, 9.5, 1, "Anna Russo", "Otturazione", "ok"], [1, 11, 1, "Carla Fiore", "Devitalizzazione", "acc"], [1, 14, 1, "Ugo Ferri", "Corona provvisoria", ""], [1, 16, 1.5, "Nadia Riva", "Estrazione", ""], [2, 10.5, .5, "Luigi Pace", "Prima visita", "ok"], [2, 12, 1, "Giada Marchi", "Sbiancamento", ""], [2, 14.5, 1, "Ivo Sanna", "Controllo", ""]] },
        { t: "celle", w: "f", h: "Poltrone adesso", stati: ["ok|Libera", "acc|Occupata", "wait|Da sanificare"], r: [["Poltrona 1", "acc|Occupata", "Pietro Sala · fino 12:00"], ["Poltrona 2", "acc|Occupata", "Carla Fiore · fino 12:00"], ["Poltrona 3", "ok|Libera", "prossimo alle 12:00"], ["Sala igiene", "wait|Da sanificare", "pronta alle 11:20"]] },
        { t: "avanz", w: "m", h: "Piani di cura in corso", r: [["Tommaso Gentile · Impianto", 60, "3 sedute su 5 · 2.400 € di 4.000 €"], ["Carla Fiore · Devitalizzazione e corona", 40, "2 sedute su 5 · rate mensili"], ["Anna Russo · Otturazioni", 75, "3 su 4"], ["Pietro Sala · Apparecchio", 35, "mese 7 di 20"]] },
        { t: "tab", w: "m", h: "Richiami da fare", filtro: true, c: ["Paziente", "Motivo", "Ultima visita", "Stato"], azione: { l: "Segna mandato", a: "ok|Mandato" },
          r: [["Sara Testa", "Igiene semestrale", "12 mar", "wait|Da mandare"], ["Davide Leone", "Controllo annuale", "2 apr", "wait|Da mandare"], ["Paola Neri", "Igiene semestrale", "20 apr", "ok|Mandato"], ["Irene Costa", "Igiene semestrale", "11 mag", "wait|Da mandare"]] }] },
      { id: "piani", nome: "Piani di cura", breve: "Piani", ic: "doc", b: [
        { t: "kpi", v: [["Piani attivi", "31", ""], ["Da incassare a rate", "12.600 €", "su 9 piani"], ["Preventivi in attesa", "6", "il più vecchio da 18 giorni"]] },
        { t: "tab", w: "l", h: "Preventivi", filtro: true, c: ["Paziente", "Cura", "Importo", "Inviato", "Stato"], azione: { l: "Segna accettato", a: "ok|Accettato" },
          r: [["Luigi Pace", "2 otturazioni e igiene", "340 €", "oggi", "wait|Da mandare"], ["Nadia Riva", "Estrazione e impianto", "2.900 €", "@d-6", "acc|In attesa"], ["Ugo Ferri", "Corona in ceramica", "780 €", "@d-18", "no|Da richiamare"], ["Ivo Sanna", "Bite notturno", "420 €", "@d-3", "ok|Accettato"]] },
        { t: "ia", w: "s", h: "Bozza di preventivo", p: "Luigi Pace: due otturazioni e igiene, 340 € in due sedute. Testo pronto da mandare via email, da controllare prima dell'invio.", a: ["Apri la bozza"], bozza: "Gentile Luigi, come detto in visita le proponiamo: igiene professionale (80 €) e due otturazioni (130 € l'una), in due sedute. Totale 340 €. Può confermare rispondendo a questa email. Studio Dentistico Esempio." }] },
      { id: "pazienti", nome: "Pazienti", ic: "people", crm: true }
    ],
    crm: {
      nome: "Pazienti", sing: "paziente", plur: "pazienti", nomeCol: "Paziente",
      fasi: ["Nuovo", "Prima visita", "In cura", "Richiamo", "In regola"], toni: ["info", "wait", "acc", "no", "ok"],
      campi: [{ k: "cura", l: "Cura", alias: ["trattamento", "terapia"] }],
      dati: [
        { nome: "Marco Bellini", tel: "333 412 0098", email: "m.bellini@example.it", fase: "In regola", ultimo: 0, cura: "Igiene", note: ["Prossima igiene tra 6 mesi"] },
        { nome: "Anna Russo", tel: "347 098 4411", email: "anna.russo@example.it", fase: "In cura", ultimo: 0, cura: "Otturazioni", note: [] },
        { nome: "Carla Fiore", tel: "320 771 2290", email: "carla.fiore@example.it", fase: "In cura", ultimo: 0, cura: "Devitalizzazione", note: ["Paga a rate mensili"] },
        { nome: "Luigi Pace", tel: "349 230 5512", email: "luigi.pace@example.it", fase: "Prima visita", ultimo: 0, cura: "Da preventivare", note: ["Preventivo promesso per oggi"] },
        { nome: "Sara Testa", tel: "338 554 1803", email: "sara.testa@example.it", fase: "Richiamo", ultimo: 250, cura: "Igiene", note: [] },
        { nome: "Davide Leone", tel: "331 867 3307", email: "d.leone@example.it", fase: "Richiamo", ultimo: 230, cura: "Controllo", note: [] },
        { nome: "Elisa Riva", tel: "329 145 7720", email: "elisa.riva@example.it", fase: "In regola", ultimo: 75, cura: "Igiene", note: [] },
        { nome: "Tommaso Gentile", tel: "345 602 9931", email: "t.gentile@example.it", fase: "In cura", ultimo: 30, cura: "Impianto", note: ["Seconda fase oggi alle 15"] },
        { nome: "Giada Marchi", tel: "333 880 1245", email: "giada.marchi@example.it", fase: "Nuovo", ultimo: 1, cura: "Sbiancamento", note: [] }
      ],
      esempio: [["Nome", "Telefono", "Email", "Cura", "Fase", "Note"], ["Rita Moro", "333 111 2233", "rita.moro@example.it", "Igiene", "Richiamo", "Ultima igiene a marzo"], ["Ugo Ferri", "347 222 3344", "ugo.ferri@example.it", "Corona", "In cura", ""], ["Nadia Riva", "320 333 4455", "nadia.riva@example.it", "Impianto", "Prima visita", "Ha paura dell'anestesia"], ["Ivo Sanna", "349 444 5566", "ivo.sanna@example.it", "Bite", "In regola", ""], ["Bianca Fois", "338 555 6677", "bianca.fois@example.it", "Ortodonzia", "Nuovo", "Figlia di 12 anni"]]
    },
    incassi: {
      base: 18420, voci: [["Tommaso Gentile", "Impianto · rata 3 di 5", 800, -4, "no"], ["Carla Fiore", "Devitalizzazione · rata 2", 250, 2, "wait"], ["Anna Russo", "Otturazione", 130, 0, "ok"], ["Pietro Sala", "Apparecchio · rata di novembre", 180, -1, "ok"], ["Ugo Ferri", "Corona provvisoria", 260, 7, "wait"], ["Marco Bellini", "Igiene", 80, 0, "ok"], ["Nadia Riva", "Acconto impianto", 900, 12, "wait"]],
      mesi: [["giu", 16.2], ["lug", 17.8], ["ago", 9.4], ["set", 19.1], ["ott", 20.6], ["nov", 18.4]],
      pd: [["Appuntamenti saltati", 12, 4, "promemoria WhatsApp il giorno prima"], ["Rate pagate in ritardo", 30, 9, "avviso automatico alla scadenza"], ["Poltrone vuote a settimana", 18, 7, "spazi liberi proposti ai richiami"]],
      ia: { h: "Promemoria rata", p: "Tommaso Gentile ha la rata 3 dell'impianto scaduta da 4 giorni. Bozza di messaggio gentile da mandare dopo il suo appuntamento di oggi.", a: ["Apri la bozza"], bozza: "Buongiorno Tommaso, le ricordiamo la terza rata del piano di cura (800 €). Se preferisce, può saldarla oggi in studio dopo la seduta delle 15:00. Grazie!" }
    }
  },

  estetica: {
    nome: "Centro Estetico Esempio", settore: "Centro estetico", sigla: "CE", tinta: "#9A5B82", utente: "SV",
    foto: ["oggi", "cabine", "clienti", "incassi"],
    viste: [
      { id: "oggi", nome: "Oggi", ic: "home", b: [
        { t: "kpi", v: [["Appuntamenti oggi", "19", "2 cabine piene"], ["Carnet attivi", "48", "6 quasi finiti"], ["Incassi del mese", "9.860 €", "fino a oggi"], ["Clienti da richiamare", "15", "assenti da 60 giorni"]] },
        { t: "lista", w: "l", h: "Agenda di oggi", r: [["9:00", "Laura Gatti", "Pulizia viso · Cabina 1 · Sofia", "ok|Fatto"], ["10:00", "Marta Villa", "Manicure semipermanente · Postazione mani", "ok|Fatto"], ["11:00", "Elena Rossi", "Massaggio drenante · Cabina 2 · Giulia", "acc|In cabina"], ["11:00", "Chiara Monti", "Epilazione laser · Cabina 3", "acc|In cabina"], ["12:00", "Silvia Bassi", "Trattamento viso · Cabina 1", "|In arrivo"], ["15:30", "Federica Neri", "Carnet 5 massaggi, 3° · Cabina 2", "|Confermato"]] },
        { t: "ia", w: "s", h: "Riepilogo del giorno", p: "Cabina 1 libera dalle 13 alle 15. Sei clienti hanno il carnet quasi finito: proporre il rinnovo con il 10% è il modo più semplice per tenerle.", a: ["Prepara i messaggi"], bozza: "Ciao Elena, ti restano 2 sedute del tuo carnet laser. Se rinnovi entro fine mese il nuovo carnet ha il 10% in meno. Vuoi che te lo prepariamo per la prossima volta?" },
        { t: "barre", w: "m", h: "Occupazione cabine, settimana", u: "%", v: [["lun", 62], ["mar", 78], ["mer", 71], ["gio", 84], ["ven", 92], ["sab", 97]] },
        { t: "check", w: "m", h: "Promemoria", r: [["Ordinare il gel per il laser", "ne resta 1 flacone"], ["Confermare le clienti di domani", "11 appuntamenti"], ["Foto prima/dopo di Chiara", "con il suo consenso"]] }] },
      { id: "cabine", nome: "Cabine", ic: "grid", b: [
        { t: "agenda", w: "f", h: "Cabine, oggi", ris: ["Cabina 1 · Viso", "Cabina 2 · Corpo", "Cabina 3 · Laser", "Mani e piedi"], da: 9, a: 19,
          ev: [[0, 9, 1, "Laura Gatti", "Pulizia viso", "ok"], [0, 12, 1, "Silvia Bassi", "Trattamento viso", ""], [0, 15, 1.5, "Giorgia Fabbri", "Peeling", ""], [1, 9.5, 1, "Anna Pini", "Drenante", "ok"], [1, 11, 1, "Elena Rossi", "Massaggio drenante", "acc"], [1, 15.5, 1, "Federica Neri", "Massaggio, carnet 3/5", ""], [1, 17, 1, "Rosa Lai", "Massaggio decontratturante", ""], [2, 11, .75, "Chiara Monti", "Laser gambe", "acc"], [2, 14, .5, "Paola Serra", "Laser viso", ""], [2, 16, 1, "Sara Longo", "Laser ascelle e inguine", ""], [3, 10, 1, "Marta Villa", "Semipermanente", "ok"], [3, 12.5, 1, "Ines Cara", "Pedicure", ""], [3, 17.5, 1, "Vera Sala", "Manicure", ""]] },
        { t: "celle", w: "f", h: "Cabine adesso", stati: ["ok|Libera", "acc|Occupata", "wait|In pulizia"], r: [["Cabina 1 · Viso", "ok|Libera", "prossima alle 12:00"], ["Cabina 2 · Corpo", "acc|Occupata", "Elena Rossi · fino 11:50"], ["Cabina 3 · Laser", "acc|Occupata", "Chiara Monti · fino 11:45"], ["Postazione mani", "ok|Libera", "dalle 11:30"], ["Postazione piedi", "wait|In pulizia", "pronta alle 11:15"]] }] },
      { id: "carnet", nome: "Carnet", ic: "card", b: [
        { t: "kpi", v: [["Carnet venduti a novembre", "14", "+4 su ottobre"], ["Sedute già pagate da fare", "126", "4.980 € di valore"], ["Rinnovi da proporre", "6", "carnet sopra l'80%"]] },
        { t: "avanz", w: "l", h: "Carnet in corso", r: [["Elena Rossi · 10 sedute laser", 80, "8 usate · rinnovo da proporre"], ["Sara Longo · 6 pulizie viso", 83, "5 usate · scade @d+20"], ["Federica Neri · 5 massaggi", 40, "2 usati · scade @d+60"], ["Anna Pini · 4 drenanti", 25, "1 usato"], ["Rosa Lai · 8 massaggi", 50, "4 usati"]] },
        { t: "ia", w: "s", h: "Messaggio di rinnovo", p: "«Ciao Elena, ti restano 2 sedute laser. Se rinnovi entro fine mese il nuovo carnet ha il 10% in meno.»", a: ["Usa questo testo"], bozza: "Ciao Elena, ti restano 2 sedute laser. Se rinnovi entro fine mese il nuovo carnet ha il 10% in meno. Vuoi che te lo prepariamo per la prossima volta? Centro Estetico Esempio" },
        { t: "tab", w: "f", h: "Pacchetti in listino", c: ["Pacchetto", "Sedute", "Prezzo", "Venduti nel 2026", "Stato"], r: [["Laser gambe complete", "10", "690 €", "38", "ok|In vendita"], ["Pulizia viso profonda", "6", "290 €", "52", "ok|In vendita"], ["Massaggio drenante", "5", "260 €", "41", "ok|In vendita"], ["Viso e collo anti-età", "8", "520 €", "12", "wait|Da rivedere"]] }] },
      { id: "clienti", nome: "Clienti", ic: "people", crm: true }
    ],
    crm: {
      nome: "Clienti", sing: "cliente", plur: "clienti", nomeCol: "Cliente",
      fasi: ["Nuova", "Prima seduta", "Con carnet", "Da richiamare", "Abituale"], toni: ["info", "wait", "acc", "no", "ok"],
      campi: [{ k: "tratt", l: "Trattamento preferito", alias: ["trattamento", "preferito"] }],
      dati: [
        { nome: "Laura Gatti", tel: "333 412 5530", email: "laura.gatti@example.it", fase: "Abituale", ultimo: 0, tratt: "Pulizia viso", note: [] },
        { nome: "Elena Rossi", tel: "347 098 6621", email: "elena.rossi@example.it", fase: "Con carnet", ultimo: 0, tratt: "Laser", note: ["Proporre rinnovo carnet"] },
        { nome: "Giorgia Fabbri", tel: "320 771 4402", email: "giorgia.f@example.it", fase: "Da richiamare", ultimo: 75, tratt: "Manicure", note: [] },
        { nome: "Marta Villa", tel: "349 230 8813", email: "marta.villa@example.it", fase: "Abituale", ultimo: 0, tratt: "Semipermanente", note: [] },
        { nome: "Paola Serra", tel: "338 554 2209", email: "paola.serra@example.it", fase: "Da richiamare", ultimo: 90, tratt: "Laser", note: ["Pelle sensibile"] },
        { nome: "Federica Neri", tel: "331 867 1196", email: "federica.neri@example.it", fase: "Con carnet", ultimo: 7, tratt: "Massaggio", note: [] },
        { nome: "Silvia Bassi", tel: "329 145 3378", email: "silvia.bassi@example.it", fase: "Prima seduta", ultimo: 0, tratt: "Viso", note: ["Arrivata da Instagram"] },
        { nome: "Ines Cara", tel: "345 602 4417", email: "ines.cara@example.it", fase: "Nuova", ultimo: 1, tratt: "Pedicure", note: [] }
      ],
      esempio: [["Nome", "Telefono", "Email", "Trattamento preferito", "Fase", "Note"], ["Vera Sala", "333 121 3434", "vera.sala@example.it", "Manicure", "Abituale", ""], ["Rosa Lai", "347 565 7878", "rosa.lai@example.it", "Massaggio", "Con carnet", "8 massaggi"], ["Dora Pisu", "320 909 1212", "dora.pisu@example.it", "Laser", "Nuova", "Regalo di compleanno"], ["Lia Murgia", "349 343 5656", "lia.murgia@example.it", "Viso", "Da richiamare", ""]]
    },
    incassi: {
      base: 9860, voci: [["Elena Rossi", "Carnet laser · saldo", 345, -3, "no"], ["Federica Neri", "Carnet massaggi · 2ª metà", 130, 5, "wait"], ["Laura Gatti", "Pulizia viso", 55, 0, "ok"], ["Marta Villa", "Semipermanente", 35, 0, "ok"], ["Rosa Lai", "Carnet 8 massaggi", 410, 1, "wait"], ["Silvia Bassi", "Trattamento viso", 60, 0, "wait"]],
      mesi: [["giu", 10.4], ["lug", 11.9], ["ago", 6.2], ["set", 10.8], ["ott", 11.3], ["nov", 9.9]],
      pd: [["Clienti perse in un anno", 38, 21, "richiami dopo 60 giorni"], ["Carnet non rinnovati", 55, 30, "proposta all'80% del carnet"], ["Buchi in agenda a settimana", 14, 5, "lista d'attesa automatica"]],
      ia: { h: "Promemoria pagamento", p: "Elena Rossi ha il saldo del carnet laser aperto. Bozza gentile da mandare prima del prossimo appuntamento.", a: ["Apri la bozza"], bozza: "Ciao Elena, ti ricordiamo il saldo del carnet laser (345 €). Puoi saldarlo alla prossima seduta, anche con carta. Grazie! Centro Estetico Esempio" }
    }
  },

  palestra: {
    nome: "Palestra Esempio", settore: "Palestra", sigla: "PA", tinta: "#23774A", utente: "LC",
    foto: ["oggi", "corsi", "iscritti", "incassi"],
    viste: [
      { id: "oggi", nome: "Oggi", ic: "home", b: [
        { t: "kpi", v: [["Iscritti attivi", "412", "+18 questo mese", "su"], ["Ingressi oggi", "96", "picco alle 18"], ["Abbonamenti in scadenza", "27", "entro 15 giorni"], ["Incassi del mese", "21.700 €", "fino a oggi"]] },
        { t: "barre", w: "m", h: "Ingressi per ora, oggi", u: "", v: [["7", 18], ["8", 22], ["9", 14], ["10", 11], ["11", 9], ["12", 0]] },
        { t: "lista", w: "m", h: "Ultimi ingressi", r: [["10:58", "Riccardo Sala", "Annuale · badge 0412", "ok|Entrato"], ["10:51", "Sofia Riva", "Annuale · badge 0377", "ok|Entrato"], ["10:47", "Matteo Conti", "Mensile scaduto da 2 giorni", "no|Bloccato al tornello"], ["10:40", "Andrea Bassi", "10 ingressi · 5 rimasti", "ok|Entrato"], ["10:32", "Chiara Neri", "Prova gratuita", "info|Prova"]] },
        { t: "ia", w: "s", h: "Rischio abbandono", p: "11 iscritti non vengono da più di tre settimane, 7 hanno l'annuale. Un messaggio con una lezione di prova di un corso nuovo di solito ne riporta qualcuno.", a: ["Prepara i messaggi"], bozza: "Ciao Matteo, è un po' che non ti vediamo! Giovedì alle 19:30 c'è una lezione di prova del nuovo corso di functional: ti teniamo un posto? Palestra Esempio" },
        { t: "lista", w: "m", h: "Corsi di oggi", r: [["9:00", "Pilates", "Sala 2 · Marta · 12 su 14", "ok|Finito"], ["12:30", "Functional", "Sala 1 · Luca · 16 su 20", "|Prenotabile"], ["18:30", "Spinning", "Sala bike · Ale · 20 su 20", "wait|Pieno"], ["19:30", "Yoga", "Sala 2 · Elisa · 9 su 15", "|Prenotabile"]] }] },
      { id: "corsi", nome: "Corsi", ic: "cal", b: [
        { t: "agenda", w: "f", h: "Sale, oggi", ris: ["Sala 1 · Functional", "Sala 2 · Pilates e yoga", "Sala bike"], da: 8, a: 22,
          ev: [[0, 9, 1, "Cross training", "Luca · 14/16", "ok"], [0, 12.5, 1, "Functional", "Luca · 16/20", ""], [0, 18, 1, "Funzionale over 50", "Dario · 10/12", ""], [0, 20, 1, "Boxe fit", "Sara · 18/18", "wait"], [1, 9, 1, "Pilates", "Marta · 12/14", "ok"], [1, 11, 1, "Posturale", "Marta · 8/10", "acc"], [1, 19.5, 1, "Yoga", "Elisa · 9/15", ""], [2, 7.5, .75, "Spinning", "Ale · 20/20", "ok"], [2, 13, .75, "Spinning pranzo", "Ale · 11/20", ""], [2, 18.5, .75, "Spinning", "Ale · 20/20", "wait"]] },
        { t: "tab", w: "l", h: "Posti nei corsi della settimana", filtro: true, c: ["Corso", "Istruttore", "Giorni", "Posti", "Stato"],
          r: [["Spinning", "Ale", "lun, mer, ven", "20 su 20", "wait|Pieno · 6 in attesa"], ["Pilates", "Marta", "mar, gio", "12 su 14", "ok|Posti liberi"], ["Functional", "Luca", "lun–ven", "16 su 20", "ok|Posti liberi"], ["Yoga", "Elisa", "mer, sab", "9 su 15", "ok|Posti liberi"], ["Boxe fit", "Sara", "mar, gio", "18 su 18", "wait|Pieno"]] },
        { t: "avanz", w: "s", h: "Riempimento medio", r: [["Spinning", 100, "aprire un turno in più?"], ["Boxe fit", 96, ""], ["Functional", 78, ""], ["Pilates", 82, ""], ["Yoga", 58, "spostarlo alle 18?"]] }] },
      { id: "abbonamenti", nome: "Abbonamenti", breve: "Rinnovi", ic: "card", b: [
        { t: "kpi", v: [["Annuali", "188", "46%"], ["Trimestrali", "97", "24%"], ["Mensili e 10 ingressi", "127", "30%"]] },
        { t: "tab", w: "l", h: "In scadenza entro 15 giorni", filtro: true, c: ["Iscritto", "Abbonamento", "Scadenza", "Ultimo ingresso", "Stato"], azione: { l: "Segna rinnovato", a: "ok|Rinnovato" },
          r: [["Giulia Ferri", "Trimestrale", "@d+9", "ieri", "wait|Da proporre"], ["Matteo Conti", "Mensile", "@d-2", "@d-24", "no|Scaduto"], ["Chiara Neri", "Mensile", "@d+4", "@d-6", "wait|Da proporre"], ["Paolo Rizzi", "Annuale", "@d+12", "oggi", "acc|Proposto"], ["Lisa Gallo", "Trimestrale", "@d+14", "@d-1", "ok|Rinnovato"]] },
        { t: "ia", w: "s", h: "Proposta di rinnovo", p: "Giulia viene 3 volte a settimana: passare all'annuale le farebbe risparmiare 140 € rispetto a 4 trimestrali. Bozza pronta.", a: ["Apri la bozza"], bozza: "Ciao Giulia, il tuo trimestrale scade tra 9 giorni. Visto che vieni spesso, con l'annuale risparmieresti 140 € rispetto a rinnovare ogni tre mesi. Ne parliamo in reception?" },
        { t: "barre", w: "m", h: "Nuovi iscritti, ultimi 6 mesi", u: "", v: [["giu", 22], ["lug", 15], ["ago", 9], ["set", 48], ["ott", 31], ["nov", 18]] }] },
      { id: "iscritti", nome: "Iscritti", ic: "people", crm: true }
    ],
    crm: {
      nome: "Iscritti", sing: "iscritto", plur: "iscritti", nomeCol: "Iscritto",
      fasi: ["Contatto", "Prova", "Iscritto", "A rischio", "Scaduto"], toni: ["info", "acc", "ok", "wait", "no"],
      campi: [{ k: "abb", l: "Abbonamento", alias: ["abbonamento", "piano"] }],
      dati: [
        { nome: "Riccardo Sala", tel: "333 412 9087", email: "riccardo.sala@example.it", fase: "Iscritto", ultimo: 0, abb: "Annuale", note: [] },
        { nome: "Giulia Ferri", tel: "347 098 1123", email: "giulia.ferri@example.it", fase: "Iscritto", ultimo: 1, abb: "Trimestrale", note: ["Proporre l'annuale"] },
        { nome: "Matteo Conti", tel: "320 771 5546", email: "matteo.conti@example.it", fase: "Scaduto", ultimo: 24, abb: "Mensile", note: [] },
        { nome: "Sofia Riva", tel: "349 230 7781", email: "sofia.riva@example.it", fase: "Iscritto", ultimo: 0, abb: "Annuale", note: [] },
        { nome: "Andrea Bassi", tel: "338 554 0039", email: "andrea.bassi@example.it", fase: "Iscritto", ultimo: 2, abb: "10 ingressi", note: [] },
        { nome: "Chiara Neri", tel: "331 867 2264", email: "chiara.neri@example.it", fase: "Prova", ultimo: 0, abb: "Prova gratuita", note: ["Interessata al pilates"] },
        { nome: "Davide Pinna", tel: "329 145 8803", email: "davide.pinna@example.it", fase: "A rischio", ultimo: 22, abb: "Annuale", note: [] },
        { nome: "Marta Cossu", tel: "345 602 1170", email: "marta.cossu@example.it", fase: "Contatto", ultimo: 1, abb: "—", note: ["Ha scritto su Instagram"] }
      ],
      esempio: [["Nome", "Telefono", "Email", "Abbonamento", "Fase", "Note"], ["Paolo Rizzi", "333 777 1212", "paolo.rizzi@example.it", "Annuale", "Iscritto", ""], ["Lisa Gallo", "347 888 2323", "lisa.gallo@example.it", "Trimestrale", "Iscritto", ""], ["Nico Deiana", "320 999 3434", "nico.deiana@example.it", "Prova gratuita", "Prova", "Vuole provare boxe"], ["Anna Melis", "349 111 4545", "anna.melis@example.it", "Mensile", "A rischio", "Assente da 3 settimane"]]
    },
    incassi: {
      base: 21700, voci: [["Matteo Conti", "Rinnovo mensile", 55, -2, "no"], ["Giulia Ferri", "Rinnovo trimestrale", 150, 9, "wait"], ["Paolo Rizzi", "Rinnovo annuale", 490, 12, "wait"], ["Lisa Gallo", "Trimestrale", 150, -1, "ok"], ["Riccardo Sala", "Personal training · 5 lezioni", 175, -3, "ok"], ["Chiara Neri", "Mensile", 55, 4, "wait"], ["Davide Pinna", "Rata annuale 2 di 2", 245, -7, "no"]],
      mesi: [["giu", 19.8], ["lug", 15.1], ["ago", 8.7], ["set", 31.2], ["ott", 24.6], ["nov", 21.7]],
      pd: [["Iscritti persi alla scadenza", 34, 19, "rinnovo proposto 15 giorni prima"], ["Ingressi con abbonamento scaduto", 9, 0, "tornello collegato al gestionale"], ["Posti vuoti nei corsi", 31, 14, "lista d'attesa automatica"]],
      ia: { h: "Rate e rinnovi scaduti", p: "Due pagamenti sono scaduti: Matteo Conti (mensile) e Davide Pinna (rata annuale). Bozza di messaggio senza toni duri.", a: ["Apri la bozza"], bozza: "Ciao Davide, ti ricordiamo la seconda rata dell'annuale (245 €). Puoi saldarla in reception o con il link di pagamento. Ti aspettiamo in sala! Palestra Esempio" }
    }
  },

  edile: {
    nome: "Edil Esempio Costruzioni", settore: "Impresa edile", sigla: "EE", tinta: "#9E5A22", utente: "GB",
    foto: ["cantieri", "sal", "committenti", "incassi"],
    viste: [
      { id: "cantieri", nome: "Cantieri", ic: "home", b: [
        { t: "kpi", v: [["Cantieri aperti", "6", "2 in chiusura"], ["Operai oggi", "18", "su 4 cantieri"], ["SAL da emettere", "2", "41.600 €"], ["Preventivi aperti", "9", "142.000 € in totale"]] },
        { t: "avanz", w: "l", h: "Avanzamento cantieri", r: [["Villetta via dei Mandorli", 72, "fine lavori prevista @d+40 · in linea"], ["Condominio Sole · facciata e tetto", 45, "4 giorni di ritardo per pioggia"], ["Capannone zona artigianale", 88, "impianti e collaudo"], ["Bagno e cucina, appartamento Rossi", 20, "demolizioni finite"], ["Box auto via Roma", 95, "pulizia finale"]] },
        { t: "ia", w: "s", h: "Riepilogo del giorno", p: "Domani pioggia al Condominio Sole: conviene spostare la squadra 2 al capannone. Mancano i DDT di due consegne di ieri. Il SAL 3 della villetta si può emettere: avanzamento oltre il 70%.", a: ["Sposta la squadra"], bozza: "Squadra 2 (Ferraro): domani al Capannone zona artigianale invece che al Condominio Sole, per pioggia. Ritrovo in sede alle 7:15. Materiale: già sul posto." },
        { t: "barre", w: "m", h: "Fatturato, ultimi 6 mesi", u: "k", v: [["giu", 62], ["lug", 71], ["ago", 28], ["set", 77], ["ott", 91], ["nov", 84]] },
        { t: "check", w: "m", h: "Da fare oggi", r: [["Caricare i DDT di ieri", "2 consegne laterizi"], ["Firmare il collaudo del box", "con il cliente alle 16"], ["Rinnovo DURC", "scade tra 12 giorni"]] }] },
      { id: "sal", nome: "SAL", ic: "doc", b: [
        { t: "kpi", v: [["SAL emessi nel 2026", "23", "612.000 €"], ["Da emettere", "2", "41.600 €"], ["Ritenute a garanzia", "30.600 €", "si liberano al collaudo"]] },
        { t: "tab", w: "f", h: "Stati di avanzamento lavori", filtro: true, esporta: "sal.csv", c: ["Cantiere", "SAL", "Avanzamento", "Importo", "Stato"], azione: { l: "Segna emesso", a: "acc|Emesso" },
          r: [["Villetta via dei Mandorli", "SAL 3", "72%", "28.400 €", "wait|Da emettere"], ["Condominio Sole", "SAL 2", "45%", "13.200 €", "wait|Da emettere"], ["Capannone zona artigianale", "SAL 4", "85%", "36.900 €", "acc|Emesso"], ["Box auto via Roma", "Saldo", "95%", "9.800 €", "ok|Pagato"], ["Villetta via dei Mandorli", "SAL 2", "50%", "31.000 €", "ok|Pagato"], ["Condominio Sole", "SAL 1", "25%", "26.500 €", "ok|Pagato"]] },
        { t: "ia", w: "m", h: "Computo con IA", p: "Dalla descrizione «bagno 6 mq, piastrelle, sanitari sospesi, doccia filo pavimento» una prima stima: 11.900–13.400 €. Le voci vanno controllate dal tecnico.", a: ["Apri il computo"], bozza: "Computo di massima · bagno 6 mq (esempio)\nDemolizioni e smaltimento: 1.400 €\nImpianto idraulico: 2.600 €\nMassetto e impermeabilizzazione: 1.300 €\nPiastrelle posate (22 mq): 3.100 €\nSanitari sospesi e doccia: 3.000–4.500 €\nTotale: 11.900–13.400 € · da verificare in sopralluogo" },
        { t: "tab", w: "m", h: "Preventivi", filtro: true, c: ["Cliente", "Lavoro", "Importo", "Stato"], azione: { l: "Segna accettato", a: "ok|Accettato" },
          r: [["Fam. De Luca", "Bagno", "14.800 €", "wait|In attesa"], ["Condominio Aurora", "Facciata", "62.000 €", "no|Da sollecitare"], ["Bar Centrale", "Bancone e pavimento", "18.500 €", "wait|In attesa"], ["Sig. Marino", "Veranda", "23.700 €", "ok|Accettato"]] }] },
      { id: "squadre", nome: "Squadre", ic: "helmet", b: [
        { t: "celle", w: "f", h: "Squadre oggi", stati: ["ok|Al lavoro", "acc|In trasferta", "wait|Ferma", "no|Assente"], r: [["Squadra 1 · Bianchi", "ok|Al lavoro", "Villetta · 5 operai · escavatore"], ["Squadra 2 · Ferraro", "ok|Al lavoro", "Condominio Sole · 6 operai · ponteggio"], ["Squadra 3 · Lombardo", "ok|Al lavoro", "Capannone · 4 operai"], ["Squadra 4 · Greco", "wait|Ferma", "App. Rossi · manca materiale"]] },
        { t: "tab", w: "l", h: "Presenze di oggi", filtro: true, esporta: "presenze.csv", c: ["Operaio", "Squadra", "Cantiere", "Entrata", "Stato"],
          r: [["Mario Bianchi", "1", "Villetta", "7:30", "ok|Presente"], ["Ciro Esposito", "1", "Villetta", "7:32", "ok|Presente"], ["Luca Ferraro", "2", "Condominio Sole", "7:45", "ok|Presente"], ["Ahmed Benali", "2", "Condominio Sole", "—", "wait|Ferie"], ["Gianni Lombardo", "3", "Capannone", "8:00", "ok|Presente"], ["Paolo Greco", "4", "App. Rossi", "8:10", "acc|In ritardo"]] },
        { t: "scad", w: "s", h: "Documenti in scadenza", r: [[5, "Verbale di collaudo", "Box auto via Roma", "wait|Da firmare"], [12, "DURC impresa", "vale per tutti i cantieri", "wait|Da rinnovare"], [30, "POS Condominio Sole", "piano di sicurezza", "ok|Valido"]] }] },
      { id: "committenti", nome: "Committenti", breve: "Clienti", ic: "people", crm: true }
    ],
    crm: {
      nome: "Committenti", sing: "committente", plur: "committenti", nomeCol: "Committente",
      fasi: ["Richiesta", "Sopralluogo", "Preventivo", "Cantiere aperto", "Chiuso"], toni: ["info", "wait", "acc", "ok", ""],
      campi: [{ k: "lavoro", l: "Lavoro", alias: ["intervento", "oggetto"] }],
      dati: [
        { nome: "Fam. De Luca", tel: "333 412 3301", email: "deluca@example.it", fase: "Preventivo", ultimo: 3, lavoro: "Ristrutturazione bagno", note: ["Vogliono iniziare a gennaio"] },
        { nome: "Condominio Aurora", tel: "081 555 4410", email: "amm.aurora@example.it", fase: "Preventivo", ultimo: 9, lavoro: "Rifacimento facciata", note: ["Assemblea il 28"] },
        { nome: "Condominio Sole", tel: "081 555 2290", email: "amm.sole@example.it", fase: "Cantiere aperto", ultimo: 0, lavoro: "Facciata e tetto", note: [] },
        { nome: "Sig. Marino", tel: "349 230 6612", email: "marino@example.it", fase: "Cantiere aperto", ultimo: 2, lavoro: "Ampliamento veranda", note: [] },
        { nome: "Bar Centrale", tel: "338 554 7701", email: "bar.centrale@example.it", fase: "Sopralluogo", ultimo: 1, lavoro: "Bancone e pavimento", note: ["Sopralluogo fatto, serve il rilievo"] },
        { nome: "Paolo Rossi", tel: "331 867 9930", email: "paolo.rossi@example.it", fase: "Cantiere aperto", ultimo: 0, lavoro: "Bagno e cucina", note: [] },
        { nome: "Studio Neri", tel: "329 145 0028", email: "studio.neri@example.it", fase: "Chiuso", ultimo: 20, lavoro: "Divisori in cartongesso", note: ["Rifiutato: prezzo"] },
        { nome: "Anna Vitale", tel: "345 602 5541", email: "anna.vitale@example.it", fase: "Richiesta", ultimo: 0, lavoro: "Cappotto termico", note: ["Chiede il bonus"] }
      ],
      esempio: [["Nome", "Telefono", "Email", "Lavoro", "Fase", "Note"], ["Fam. Russo", "333 123 4567", "russo@example.it", "Tetto", "Richiesta", "Infiltrazioni"], ["Hotel Mare", "081 555 9090", "hotelmare@example.it", "Bagni camere", "Sopralluogo", "12 bagni"], ["Sig.ra Conte", "347 765 4321", "conte@example.it", "Cucina", "Preventivo", ""], ["Parrocchia San Rocco", "081 555 1212", "sanrocco@example.it", "Campanile", "Richiesta", ""]]
    },
    incassi: {
      base: 84300, voci: [["Capannone zona artigianale", "SAL 4", 36900, -15, "no"], ["Villetta via dei Mandorli", "SAL 3", 28400, 10, "wait"], ["Condominio Sole", "SAL 2", 13200, 20, "wait"], ["Box auto via Roma", "Saldo", 9800, -6, "ok"], ["Sig. Marino", "Acconto veranda", 7100, -2, "ok"], ["Paolo Rossi", "Acconto bagno e cucina", 4500, 3, "wait"]],
      mesi: [["giu", 62], ["lug", 71], ["ago", 28], ["set", 77], ["ott", 91], ["nov", 84]],
      pd: [["SAL emessi in ritardo", 40, 8, "avviso quando si supera la soglia"], ["Ore per le presenze a fine mese", 14, 2, "presenze dal telefono in cantiere"], ["DDT persi o caricati tardi", 22, 3, "foto del DDT dal cantiere"]],
      ia: { h: "Sollecito SAL", p: "Il SAL 4 del capannone (36.900 €) è scaduto da 15 giorni. Bozza di sollecito formale, con il riferimento al contratto.", a: ["Apri il sollecito"], bozza: "Spett.le committente, con riferimento al contratto d'appalto del capannone in zona artigianale, le ricordiamo il pagamento del SAL 4 (36.900 €), scaduto il mese scorso. Restiamo a disposizione. Edil Esempio Costruzioni" }
    }
  },

  termoidraulica: {
    nome: "Termoidraulica Esempio", settore: "Termoidraulica", sigla: "TE", tinta: "#1C7479", utente: "AF",
    foto: ["interventi", "caldaie", "clienti", "incassi"],
    viste: [
      { id: "interventi", nome: "Interventi", ic: "home", b: [
        { t: "kpi", v: [["Interventi oggi", "11", "3 urgenti"], ["Tecnici in giro", "4 di 5", ""], ["Manutenzioni del mese", "64", "18 da fissare"], ["Da incassare", "4.380 €", "23 fatture"]] },
        { t: "lista", w: "l", h: "Interventi di oggi", r: [["8:30", "Fam. Russo · via Verdi 12", "Caldaia in blocco · Andrea", "ok|Chiuso"], ["9:30", "Bar Sport", "Perdita sotto il lavello · Marco", "ok|Chiuso"], ["10:30", "Sig.ra Galli · via Po 4", "Manutenzione caldaia · Andrea", "acc|In corso"], ["11:00", "Condominio Ulivi", "Acqua calda assente · Luca", "no|Urgente"], ["14:00", "Studio Moretti", "Installazione climatizzatore · Marco e Davide", "|Programmato"], ["16:30", "Fam. Conti", "Sopralluogo bagno", "|Programmato"]] },
        { t: "ia", w: "s", h: "Riepilogo del giorno", p: "Il Condominio Ulivi ha chiamato due volte: priorità alta, Luca è a 8 minuti. Per la Sig.ra Galli serve uno scambiatore: è in magazzino (1 pezzo, poi da riordinare).", a: ["Avvisa il cliente"], bozza: "Buongiorno, il nostro tecnico Luca arriva da voi tra circa 8 minuti per il problema dell'acqua calda. Termoidraulica Esempio" },
        { t: "celle", w: "f", h: "Tecnici adesso", stati: ["ok|Libero", "acc|Da un cliente", "wait|In viaggio", "no|Assente"], r: [["Andrea", "acc|Da un cliente", "Sig.ra Galli · fine 11:30"], ["Marco", "ok|Libero", "in sede"], ["Luca", "wait|In viaggio", "verso Condominio Ulivi · 11:08"], ["Davide", "ok|Libero", "dalle 14 con Marco"], ["Simone", "no|Assente", "ferie, rientra @d+3"]] }] },
      { id: "caldaie", nome: "Manutenzioni", breve: "Caldaie", ic: "flame", b: [
        { t: "kpi", v: [["Caldaie seguite", "1.240", "contratti attivi"], ["Controlli a novembre", "64", "46 fatti"], ["Da fissare entro 30 giorni", "18", "promemoria pronti"]] },
        { t: "scad", w: "l", h: "Controlli in scadenza", r: [[0, "Pizzeria Napoli · murale 35 kW", "ultimo controllo un anno fa", "no|Scade oggi"], [7, "Fam. Bruno · condensazione", "via Manzoni 8", "wait|Da fissare"], [10, "Fam. Rizzi · condensazione", "fissato con Andrea", "ok|Fissato"], [25, "Sig. Pellegrini · basamento a gas", "bollino blu", "wait|Da fissare"], [32, "Scuola Arcobaleno · centrale termica", "contratto annuale", "acc|Da preparare"]] },
        { t: "ia", w: "s", h: "Previsione", p: "A dicembre scadono 41 controlli, 12 in più di novembre. Conviene mandare ora i promemoria a chi scade entro 30 giorni.", a: ["Prepara i promemoria"], bozza: "Buongiorno, la manutenzione annuale della sua caldaia scade il mese prossimo. Possiamo passare martedì mattina o giovedì pomeriggio: quale preferisce? Termoidraulica Esempio" },
        { t: "tab", w: "f", h: "Libretti di impianto", filtro: true, esporta: "manutenzioni.csv", c: ["Cliente", "Caldaia", "Ultimo controllo", "Prossimo", "Stato"], azione: { l: "Segna fatto", a: "ok|Fatto" },
          r: [["Fam. Bruno", "Murale a condensazione", "@d-358", "@d+7", "wait|Da fissare"], ["Sig. Pellegrini", "Basamento a gas", "@d-340", "@d+25", "wait|Da fissare"], ["Pizzeria Napoli", "Murale 35 kW", "@d-365", "oggi", "no|Scaduta"], ["Fam. Rizzi", "Murale a condensazione", "@d-300", "@d+10", "acc|Fissata"], ["Sig.ra Ferri", "Pompa di calore", "@d-200", "@d+165", "ok|Fatto"]] }] },
      { id: "magazzino", nome: "Magazzino", ic: "box", b: [
        { t: "kpi", v: [["Articoli", "312", "in magazzino e sui furgoni"], ["Sotto scorta", "4", "da riordinare"], ["Valore", "18.640 €", "al prezzo d'acquisto"]] },
        { t: "tab", w: "l", h: "Ricambi", filtro: true, esporta: "magazzino.csv", c: ["Articolo", "Codice", "Disponibili", "Minimo", "Stato"], azione: { l: "Segna ordinato", a: "acc|Ordinato" },
          imp: { cosa: "articoli", es: [["Termocoppia universale", "TC-01", "8", "3"], ["Pompa di circolazione", "PC-25", "2", "2"], ["Raccordo a pressare 16", "RP-16", "140", "50"]] },
          r: [["Scambiatore secondario", "SC-210", "1", "2", "wait|Da riordinare"], ["Vaso di espansione 8 L", "VE-08", "6", "3", "ok|Ok"], ["Valvola a tre vie", "V3-55", "0", "2", "no|Esaurito"], ["Flussostato", "FL-12", "4", "2", "ok|Ok"], ["Sonda NTC", "NTC-10", "9", "4", "ok|Ok"], ["Rubinetto lavello", "RB-30", "2", "3", "wait|Da riordinare"]] },
        { t: "check", w: "s", h: "Ordine al fornitore", r: [["Valvola a tre vie × 4", "urgente, 2 interventi fermi"], ["Scambiatore secondario × 2", ""], ["Rubinetti lavello × 6", ""]] },
        { t: "barre", w: "m", h: "Interventi per tecnico, questo mese", u: "", v: [["Andrea", 42], ["Marco", 38], ["Luca", 35], ["Davide", 29], ["Simone", 18]] }] },
      { id: "clienti", nome: "Clienti", ic: "people", crm: true }
    ],
    crm: {
      nome: "Clienti", sing: "cliente", plur: "clienti", nomeCol: "Cliente",
      fasi: ["Richiesta", "Sopralluogo", "Preventivo", "Con contratto", "Saltuario"], toni: ["info", "wait", "acc", "ok", ""],
      campi: [{ k: "impianto", l: "Impianto", alias: ["caldaia", "apparecchio"] }],
      dati: [
        { nome: "Fam. Russo", tel: "333 412 2208", email: "russo.f@example.it", fase: "Con contratto", ultimo: 0, impianto: "Murale a condensazione", note: ["Caldaia in blocco, risolto"] },
        { nome: "Condominio Ulivi", tel: "081 555 3321", email: "amm.ulivi@example.it", fase: "Con contratto", ultimo: 0, impianto: "Centrale termica", note: ["Urgenza acqua calda"] },
        { nome: "Sig.ra Galli", tel: "320 771 8810", email: "galli@example.it", fase: "Con contratto", ultimo: 0, impianto: "Murale a gas", note: [] },
        { nome: "Studio Moretti", tel: "349 230 4476", email: "moretti@studio.example", fase: "Preventivo", ultimo: 4, impianto: "Climatizzatore 3 split", note: ["Installazione oggi alle 14"] },
        { nome: "Fam. Conti", tel: "338 554 3390", email: "conti@example.it", fase: "Sopralluogo", ultimo: 0, impianto: "Bagno nuovo", note: [] },
        { nome: "Bar Sport", tel: "331 867 0045", email: "barsport@example.it", fase: "Saltuario", ultimo: 0, impianto: "Idraulica", note: [] },
        { nome: "Pizzeria Napoli", tel: "329 145 9912", email: "pizzerianapoli@example.it", fase: "Con contratto", ultimo: 365, impianto: "Murale 35 kW", note: ["Controllo scaduto oggi"] },
        { nome: "Marco Sechi", tel: "345 602 7783", email: "marco.sechi@example.it", fase: "Richiesta", ultimo: 0, impianto: "Pompa di calore", note: ["Vuole sostituire la caldaia"] }
      ],
      esempio: [["Nome", "Telefono", "Email", "Impianto", "Fase", "Note"], ["Fam. Bruno", "333 202 3030", "bruno@example.it", "Murale a condensazione", "Con contratto", ""], ["Sig. Pellegrini", "347 404 5050", "pellegrini@example.it", "Basamento a gas", "Con contratto", "Bollino blu"], ["Scuola Arcobaleno", "081 555 6060", "arcobaleno@scuola.example", "Centrale termica", "Preventivo", "Contratto annuale"], ["Fam. Rizzi", "320 707 8080", "rizzi@example.it", "Murale a condensazione", "Con contratto", ""]]
    },
    incassi: {
      base: 15200, voci: [["Condominio Ulivi", "Intervento urgente", 240, 0, "wait"], ["Pizzeria Napoli", "Manutenzione 2025", 160, -40, "no"], ["Studio Moretti", "Climatizzatore, acconto", 1200, 0, "wait"], ["Fam. Russo", "Sblocco caldaia", 90, 0, "ok"], ["Bar Sport", "Riparazione perdita", 120, 0, "ok"], ["Sig. Pellegrini", "Bollino blu", 130, -12, "no"], ["Fam. Rizzi", "Manutenzione annuale", 110, 10, "wait"]],
      mesi: [["giu", 13.1], ["lug", 11.4], ["ago", 7.9], ["set", 14.8], ["ott", 17.2], ["nov", 15.2]],
      pd: [["Manutenzioni dimenticate", 15, 2, "promemoria automatico 30 giorni prima"], ["Viaggi a vuoto in magazzino", 20, 6, "scorte dei furgoni nel gestionale"], ["Fatture fatte a fine mese", 100, 10, "fattura dal telefono a fine intervento"]],
      ia: { h: "Sollecito", p: "La Pizzeria Napoli ha la manutenzione dell'anno scorso ancora da pagare. Bozza da mandare insieme al promemoria del nuovo controllo.", a: ["Apri la bozza"], bozza: "Buongiorno, oltre al controllo annuale della caldaia (scade oggi), risulta ancora aperta la manutenzione dell'anno scorso (160 €). Possiamo sistemare tutto alla prossima visita. Termoidraulica Esempio" }
    }
  },

  ristorante: {
    nome: "Pizzeria Esempio", settore: "Ristorante e pizzeria", sigla: "PE", tinta: "#B0413A", utente: "CR",
    foto: ["serata", "tavoli", "clienti", "incassi"],
    viste: [
      { id: "serata", nome: "Oggi", ic: "home", b: [
        { t: "kpi", v: [["Coperti prenotati", "86", "pranzo 24 · cena 62"], ["Ordini d'asporto", "31", "12 per le 20:00"], ["Incasso di ieri", "3.240 €", "+8% sul martedì prima", "su"], ["Scorte basse", "4", "mozzarella, birra"]] },
        { t: "lista", w: "l", h: "Ordini in arrivo", r: [["10:40", "Asporto · Marco", "2 Capricciosa, 1 fritti misti · ritiro 12:15", "acc|Confermato"], ["10:52", "Consegna · via Dante 3", "4 Margherita, 2 birre · 12:30", "acc|Confermato"], ["10:58", "Tavolo 6 · 4 coperti", "prenotazione Riva · 13:00", "|In arrivo"], ["11:00", "Asporto · Giulia", "1 Bufala, 1 insalata · 12:00", "wait|Da confermare"], ["11:00", "Tavolo 2 · 6 coperti", "prenotazione Bianchi · 12:30", "|In arrivo"]] },
        { t: "ia", w: "s", h: "Previsione della serata", p: "Mercoledì con pioggia: di solito l'asporto sale del 20%. Stima per stasera 45 ordini. Mozzarella sufficiente per circa 120 pizze: ordinarne 5 kg in più.", a: ["Aggiungi all'ordine"], bozza: "Ordine al Caseificio Esempio\nMozzarella fior di latte: +5 kg (totale 22 kg)\nConsegna: domattina entro le 9:00" },
        { t: "barre", w: "m", h: "Incassi della settimana", u: "", v: [["lun", 0], ["mar", 3240], ["mer", 2980], ["gio", 3410], ["ven", 5120], ["sab", 6340]] },
        { t: "check", w: "m", h: "Prima del servizio", r: [["Impasto per 180 pizze", "pronto alle 17"], ["Chiamare il caseificio", "mozzarella +5 kg"], ["Dehors: chiuso per pioggia", "avvisare le prenotazioni"]] }] },
      { id: "tavoli", nome: "Sala", ic: "table", b: [
        { t: "celle", w: "f", h: "Tavoli adesso", stati: ["ok|Libero", "wait|Prenotato", "acc|Occupato", "info|Al conto", "no|Chiuso"], r: [["Tavolo 1", "ok|Libero", "4 posti"], ["Tavolo 2", "wait|Prenotato", "6 posti · Bianchi 12:30"], ["Tavolo 3", "ok|Libero", "2 posti"], ["Tavolo 4", "acc|Occupato", "3 coperti · dalle 10:50"], ["Tavolo 5", "ok|Libero", "4 posti"], ["Tavolo 6", "wait|Prenotato", "4 posti · Riva 13:00"], ["Tavolo 7", "ok|Libero", "2 posti"], ["Tavolo 8", "ok|Libero", "8 posti"], ["Tavolo 9", "info|Al conto", "2 coperti"], ["Dehors 1", "no|Chiuso", "pioggia"]] },
        { t: "tab", w: "l", h: "Prenotazioni di stasera", filtro: true, c: ["Nome", "Ora", "Persone", "Note", "Stato"], azione: { l: "Conferma", a: "ok|Confermata" },
          r: [["Bianchi", "12:30", "6", "compleanno, torta loro", "ok|Confermata"], ["Riva", "13:00", "4", "", "ok|Confermata"], ["Sanna", "20:00", "2", "tavolo vicino alla finestra", "wait|Da confermare"], ["Cossu", "20:30", "8", "2 bambini, seggiolone", "wait|Da confermare"], ["Melis", "21:00", "3", "celiaco", "ok|Confermata"]] },
        { t: "ia", w: "s", h: "Messaggio di conferma", p: "Due prenotazioni di stasera non sono confermate. Bozza del messaggio WhatsApp con il dehors chiuso per pioggia.", a: ["Apri la bozza"], bozza: "Ciao, ti confermiamo il tavolo per 8 alle 20:30. Stasera il dehors è chiuso per pioggia, ma il tavolo è in sala con il seggiolone pronto. A stasera! Pizzeria Esempio" }] },
      { id: "magazzino", nome: "Magazzino", ic: "box", b: [
        { t: "tab", w: "l", h: "Scorte", filtro: true, esporta: "scorte.csv", c: ["Prodotto", "Fornitore", "Disponibile", "Serve stasera", "Stato"], azione: { l: "Segna ordinato", a: "acc|Ordinato" },
          imp: { cosa: "prodotti", es: [["Olio extravergine", "Frantoio Esempio", "12 L", "4 L"], ["Ricotta", "Caseificio Esempio", "3 kg", "2 kg"], ["Acqua naturale", "Bevande Esempio", "48", "60"]] },
          r: [["Mozzarella fior di latte", "Caseificio Esempio", "12 kg", "17 kg", "wait|Da ordinare"], ["Farina tipo 1", "Molino Esempio", "50 kg", "20 kg", "ok|Ok"], ["Pomodoro pelato", "Conserve Esempio", "36 latte", "10 latte", "ok|Ok"], ["Birra bionda 33 cl", "Bevande Esempio", "18", "40", "wait|Da ordinare"], ["Basilico", "Orto Esempio", "1 cassetta", "1 cassetta", "ok|Ok"], ["Cartoni pizza", "Imballi Esempio", "40", "60", "no|Sotto scorta"]] },
        { t: "check", w: "s", h: "Ordine fornitori", r: [["Mozzarella 5 kg", "consegna domattina"], ["Birra 2 casse", "entro venerdì"], ["Cartoni pizza 200", "ultimi 40"]] },
        { t: "kpi", v: [["Costo del cibo", "28%", "sugli incassi di ottobre"], ["Sprechi segnati", "3,1 kg", "questa settimana"], ["Fornitori", "7", "2 consegne oggi"]] }] },
      { id: "clienti", nome: "Clienti", ic: "people", crm: true }
    ],
    crm: {
      nome: "Clienti", sing: "cliente", plur: "clienti", nomeCol: "Cliente",
      fasi: ["Nuovo", "Occasionale", "Abituale", "Evento", "Da recuperare"], toni: ["info", "", "ok", "acc", "wait"],
      campi: [{ k: "pref", l: "Preferenze", alias: ["allergie", "note cucina"] }],
      dati: [
        { nome: "Famiglia Bianchi", tel: "333 412 6670", email: "bianchi@example.it", fase: "Evento", ultimo: 0, pref: "Compleanno, 6 persone", note: ["Torta portata da loro"] },
        { nome: "Paolo Riva", tel: "347 098 3345", email: "paolo.riva@example.it", fase: "Abituale", ultimo: 0, pref: "Diavola ben cotta", note: [] },
        { nome: "Giulia Sanna", tel: "320 771 9901", email: "giulia.sanna@example.it", fase: "Occasionale", ultimo: 12, pref: "Tavolo alla finestra", note: [] },
        { nome: "Marco Cossu", tel: "349 230 2287", email: "marco.cossu@example.it", fase: "Abituale", ultimo: 3, pref: "Asporto il venerdì", note: [] },
        { nome: "Elisa Melis", tel: "338 554 6612", email: "elisa.melis@example.it", fase: "Abituale", ultimo: 0, pref: "Celiaca", note: ["Impasto senza glutine"] },
        { nome: "Ditta Rossi", tel: "081 555 8899", email: "eventi@dittarossi.example", fase: "Evento", ultimo: 6, pref: "Cena aziendale 30 persone", note: ["Preventivo menu fisso 28 €"] },
        { nome: "Luca Fadda", tel: "331 867 4432", email: "luca.fadda@example.it", fase: "Da recuperare", ultimo: 80, pref: "Margherita e birra", note: ["Veniva ogni settimana"] },
        { nome: "Sara Piras", tel: "329 145 2209", email: "sara.piras@example.it", fase: "Nuovo", ultimo: 1, pref: "Vegana", note: [] }
      ],
      esempio: [["Nome", "Telefono", "Email", "Preferenze", "Fase", "Note"], ["Anna Loi", "333 300 4000", "anna.loi@example.it", "Senza lattosio", "Abituale", ""], ["Circolo Tennis", "081 555 5000", "circolo@tennis.example", "Cena di fine anno", "Evento", "40 persone"], ["Pietro Usai", "347 600 7000", "pietro.usai@example.it", "Bufala", "Occasionale", ""], ["Rita Serra", "320 800 9000", "rita.serra@example.it", "Bambini", "Nuovo", ""]]
    },
    incassi: {
      base: 41000, voci: [["Ditta Rossi", "Acconto cena aziendale", 300, 4, "wait"], ["Circolo Tennis", "Cena di ottobre, saldo", 1120, -18, "no"], ["Sala · pranzo di ieri", "Incasso cassa", 1080, -1, "ok"], ["Sala · cena di ieri", "Incasso cassa", 2160, -1, "ok"], ["Consegne · app", "Bonifico settimanale", 860, 2, "wait"], ["Famiglia Bianchi", "Caparra compleanno", 50, 0, "ok"]],
      mesi: [["giu", 48], ["lug", 56], ["ago", 61], ["set", 47], ["ott", 44], ["nov", 41]],
      pd: [["Prenotazioni che non si presentano", 11, 3, "conferma WhatsApp il giorno stesso"], ["Mozzarella buttata a settimana (kg)", 6, 2, "ordine calcolato sulla previsione"], ["Tempo per chiudere la cassa", 40, 10, "incassi divisi per canale in automatico"]],
      ia: { h: "Sollecito evento", p: "Il saldo della cena di ottobre del Circolo Tennis (1.120 €) è aperto da 18 giorni. Bozza cortese, con il riepilogo della serata.", a: ["Apri la bozza"], bozza: "Buongiorno, grazie ancora per la cena di ottobre (36 persone). Le ricordiamo il saldo di 1.120 €: le giriamo IBAN e fattura in allegato. Pizzeria Esempio" }
    }
  },

  hotel: {
    nome: "Hotel Esempio", settore: "Hotel e B&B", sigla: "HE", tinta: "#33739A", utente: "FD",
    foto: ["oggi", "camere", "ospiti", "incassi"],
    viste: [
      { id: "oggi", nome: "Oggi", ic: "home", b: [
        { t: "kpi", v: [["Camere occupate", "18 di 24", "75%"], ["Arrivi oggi", "7", "2 dopo le 22"], ["Partenze oggi", "5", "3 già uscite"], ["Prezzo medio", "112 €", "a notte, novembre"]] },
        { t: "lista", w: "l", h: "Arrivi e partenze", r: [["8:40", "Partenza · camera 204", "Fam. Weber · 3 notti", "ok|Uscita"], ["9:10", "Partenza · camera 112", "Sig. Costa · 1 notte", "ok|Uscita"], ["10:30", "Partenza · camera 301", "Sig.ra Lunardi", "ok|Uscita"], ["11:00", "Partenza · camera 208", "Coppia Martin", "acc|Al check-out"], ["14:00", "Arrivo · camera 105", "Sig. Brambilla · Booking", "|In arrivo"], ["22:30", "Arrivo · camera 310", "Sig.ra Ricci · tardi, chiavi in cassetta", "wait|Da preparare"]] },
        { t: "ia", w: "s", h: "Riepilogo del giorno", p: "Sabato siete al 96%: il prezzo può salire di 15 € sulle ultime camere. Due ospiti arrivano dopo le 22: mandare il codice della cassetta.", a: ["Manda il codice"], bozza: "Buonasera Sig.ra Ricci, arriverà dopo la chiusura della reception: le chiavi della camera 310 sono nella cassetta all'ingresso, codice 4 8 1 2. Buon viaggio! Hotel Esempio" },
        { t: "barre", w: "m", h: "Occupazione, prossimi 7 giorni", u: "%", v: [["mer", 75], ["gio", 71], ["ven", 88], ["sab", 96], ["dom", 54], ["lun", 42]] },
        { t: "check", w: "m", h: "Reception", r: [["Schedine alloggiati di ieri", "da inviare entro le 24 ore"], ["Tassa di soggiorno di ottobre", "versamento entro il 16"], ["Taxi per la Fam. Weber", "fatto"]] }] },
      { id: "camere", nome: "Camere", ic: "bed", b: [
        { t: "celle", w: "f", h: "Camere adesso", stati: ["ok|Pronta", "acc|Occupata", "wait|Da pulire", "info|In pulizia", "no|Fuori servizio"], r: [["101 · Doppia", "acc|Occupata", "Neri · parte @d+2"], ["102 · Doppia", "ok|Pronta", ""], ["105 · Matrimoniale", "info|In pulizia", "arrivo alle 14"], ["112 · Singola", "wait|Da pulire", "uscito alle 9:10"], ["204 · Tripla", "wait|Da pulire", "uscita alle 8:40"], ["208 · Matrimoniale", "acc|Occupata", "check-out in corso"], ["210 · Doppia", "ok|Pronta", ""], ["301 · Suite", "info|In pulizia", ""], ["305 · Doppia", "no|Fuori servizio", "perdita doccia"], ["310 · Matrimoniale", "ok|Pronta", "arrivo alle 22:30"]] },
        { t: "tab", w: "l", h: "Prenotazioni", filtro: true, esporta: "prenotazioni.csv", c: ["Ospite", "Camera", "Date", "Canale", "Stato"], azione: { l: "Segna pagata", a: "ok|Pagata" },
          r: [["Brambilla", "105", "oggi → @d+3", "Booking", "acc|Arriva oggi"], ["Ricci", "310", "oggi → @d+1", "Diretta", "wait|Acconto da ricevere"], ["Hoffmann", "210", "@d+2 → @d+6", "Diretta", "ok|Pagata"], ["Fam. Leone", "204", "@d+3 → @d+5", "Expedia", "acc|Confermata"], ["Durand", "102", "@d+4 → @d+7", "Booking", "acc|Confermata"]] },
        { t: "ia", w: "s", h: "Risposta alla recensione", p: "Recensione di ieri, 4 stelle: «camera bella, colazione da migliorare». Bozza di risposta pronta da controllare.", a: ["Usa la bozza"], bozza: "Grazie per averci scelto e per il suggerimento sulla colazione: da questa settimana abbiamo aggiunto prodotti freschi del forno qui accanto. Speriamo di rivederla presto! La direzione, Hotel Esempio" }] },
      { id: "pulizie", nome: "Pulizie", ic: "check", b: [
        { t: "kpi", v: [["Camere da pulire", "6", "3 per gli arrivi di oggi"], ["Pulite oggi", "9", "dalle 8:00"], ["Personale in turno", "3", "Rosa, Ana, Lucia"]] },
        { t: "check", w: "m", h: "Giro di oggi · Rosa", r: [["105 · per l'arrivo delle 14", "precedenza"], ["112 · cambio completo", ""], ["204 · cambio completo", "letto aggiunto da togliere"]] },
        { t: "check", w: "m", h: "Giro di oggi · Ana", r: [["301 · suite", "in corso"], ["208 · dopo il check-out", ""], ["Corridoio 2° piano", ""]] },
        { t: "tab", w: "f", h: "Segnalazioni", filtro: true, c: ["Camera", "Problema", "Segnalato", "Stato"], azione: { l: "Segna risolto", a: "ok|Risolto" },
          r: [["305", "Perdita dalla doccia", "@d-1", "no|Idraulico domani"], ["210", "Lampadina comodino", "oggi", "wait|Da fare"], ["101", "Telecomando TV", "@d-2", "ok|Risolto"]] }] },
      { id: "ospiti", nome: "Ospiti", ic: "people", crm: true }
    ],
    crm: {
      nome: "Ospiti", sing: "ospite", plur: "ospiti", nomeCol: "Ospite",
      fasi: ["Richiesta", "Prenotato", "In struttura", "Partito", "Da ricontattare"], toni: ["info", "acc", "ok", "", "wait"],
      campi: [{ k: "canale", l: "Canale", alias: ["origine", "portale"] }],
      dati: [
        { nome: "Marco Brambilla", tel: "333 412 1145", email: "m.brambilla@example.it", fase: "Prenotato", ultimo: 0, canale: "Booking", note: [] },
        { nome: "Laura Ricci", tel: "347 098 7752", email: "laura.ricci@example.it", fase: "Prenotato", ultimo: 0, canale: "Diretta", note: ["Arriva dopo le 22"] },
        { nome: "Fam. Weber", tel: "+49 151 2233 4455", email: "weber@example.de", fase: "Partito", ultimo: 0, canale: "Diretta", note: ["Tornano ogni anno a maggio"] },
        { nome: "Anna Hoffmann", tel: "+49 160 9988 7766", email: "a.hoffmann@example.de", fase: "Prenotato", ultimo: 2, canale: "Diretta", note: [] },
        { nome: "Coppia Martin", tel: "+33 6 12 34 56 78", email: "martin@example.fr", fase: "In struttura", ultimo: 0, canale: "Booking", note: [] },
        { nome: "Giovanni Neri", tel: "338 554 8821", email: "g.neri@example.it", fase: "In struttura", ultimo: 1, canale: "Expedia", note: [] },
        { nome: "Paola Lunardi", tel: "331 867 6620", email: "p.lunardi@example.it", fase: "Da ricontattare", ultimo: 0, canale: "Diretta", note: ["Vuole tornare a Natale"] },
        { nome: "Ditta Fontana", tel: "02 555 4433", email: "viaggi@fontana.example", fase: "Richiesta", ultimo: 1, canale: "Email", note: ["4 camere per una fiera a marzo"] }
      ],
      esempio: [["Nome", "Telefono", "Email", "Canale", "Fase", "Note"], ["Claire Durand", "+33 6 98 76 54 32", "durand@example.fr", "Booking", "Prenotato", ""], ["Fam. Leone", "333 999 8877", "leone@example.it", "Expedia", "Prenotato", "Culla in camera"], ["Studio Galli", "02 555 1122", "galli@studio.example", "Email", "Richiesta", "Convenzione aziendale"], ["Tom Baker", "+44 7700 900123", "tom.baker@example.co.uk", "Diretta", "Partito", ""]]
    },
    incassi: {
      base: 52800, voci: [["Laura Ricci", "Acconto camera 310", 60, 0, "wait"], ["Booking", "Bonifico di ottobre", 6840, 5, "wait"], ["Expedia", "Bonifico di ottobre", 2310, -4, "no"], ["Fam. Weber", "Soggiorno 3 notti", 486, 0, "ok"], ["Anna Hoffmann", "Caparra", 150, -3, "ok"], ["Ditta Fontana", "Acconto convenzione", 800, 15, "wait"]],
      mesi: [["giu", 71.4], ["lug", 98.2], ["ago", 112.6], ["set", 84.1], ["ott", 61.7], ["nov", 52.8]],
      pd: [["Prenotazioni dirette", 18, 34, "sito e WhatsApp collegati al planning"], ["Camere pronte in ritardo", 12, 3, "giro delle pulizie in tempo reale"], ["Commissioni ai portali", 17, 12, "più dirette, meno portali"]],
      ia: { h: "Sollecito al portale", p: "Il bonifico di Expedia di ottobre (2.310 €) è in ritardo di 4 giorni. Bozza di richiesta all'assistenza con i riferimenti delle prenotazioni.", a: ["Apri la bozza"], bozza: "Buongiorno, non abbiamo ancora ricevuto il pagamento di ottobre (2.310 €, 9 prenotazioni). Vi chiediamo di verificare. In allegato l'elenco dei codici prenotazione. Hotel Esempio" }
    }
  }
};
